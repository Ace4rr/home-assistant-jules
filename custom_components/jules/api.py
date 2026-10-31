"""API client for the public Jules REST API (v1alpha)."""
from __future__ import annotations

import logging
from typing import Any

import aiohttp

_LOGGER = logging.getLogger(__name__)

DEFAULT_BASE = "https://jules.googleapis.com"


class JulesApiError(Exception):
    """Raised when the Jules API call fails."""


class JulesApiClient:
    """Client for interacting with the Jules API."""

    def __init__(self, api_url: str, token: str, session: aiohttp.ClientSession):
        base = (api_url or "").strip() or DEFAULT_BASE
        if base.endswith("/v1alpha"):
            self._base = base
        else:
            self._base = base.rstrip("/") + "/v1alpha"
        self._token = token
        self._session = session

    def _headers(self) -> dict[str, str]:
        return {
            "X-Goog-Api-Key": self._token,
            "Content-Type": "application/json",
        }

    async def _request(
        self,
        method: str,
        path: str,
        params: dict[str, Any] | None = None,
        json: dict[str, Any] | None = None,
    ) -> Any:
        url = f"{self._base}{path}"
        try:
            async with self._session.request(
                method,
                url,
                headers=self._headers(),
                params=params,
                json=json,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as resp:
                body = await resp.text()
                if resp.status >= 400:
                    _LOGGER.error(
                        "Jules API %s %s failed: %s %s",
                        method,
                        url,
                        resp.status,
                        body[:300],
                    )
                    raise JulesApiError(f"{resp.status}: {body[:200]}")
                return await resp.json(content_type=None)
        except aiohttp.ClientError as err:
            _LOGGER.error("Jules API connection error (%s %s): %s", method, url, err)
            raise JulesApiError(str(err)) from err

    async def list_sources(self) -> list[dict[str, Any]]:
        """List connected codebases (GitHub repos)."""
        data = await self._request("GET", "/sources")
        sources = []
        seen = set()
        for item in data.get("sources", []) or []:
            name = item.get("name", "")
            gh = item.get("githubRepo") or {}
            if not isinstance(gh, dict):
                gh = {}
            owner = gh.get("owner")
            if isinstance(owner, dict):
                owner = owner.get("username") or owner.get("login") or owner.get("name") or ""
            owner = str(owner or "")
            repo_name = str(gh.get("name") or gh.get("repository") or "")
            if "/" in repo_name:
                owner_part, _, name_part = repo_name.rpartition("/")
                owner = owner or owner_part
                repo_name = name_part
            repo = "/".join(p for p in (owner, repo_name) if p)
            if not repo:
                repo = item.get("title") or name
                _LOGGER.warning("Jules sources: cannot parse repo from item: %.300s", str(item))
            key = repo or name
            if key in seen:
                continue
            seen.add(key)
            sources.append(
                {
                    "id": name,
                    "title": item.get("title") or repo or name,
                    "repo": repo,
                    "branch": gh.get("defaultBranch", "main"),
                }
            )
        return sources

    async def list_sessions(self) -> list[dict[str, Any]]:
        """List recent sessions."""
        data = await self._request("GET", "/sessions", params={"pageSize": 25})
        sessions = []
        for item in data.get("sessions", []) or []:
            name = item.get("name", "")
            source_id = None
            ctx = item.get("sourceContext", {}) or {}
            srcs = ctx.get("sources", []) or []
            if srcs and isinstance(srcs[0], dict):
                source_id = srcs[0].get("source") or srcs[0].get("name")
            sessions.append(
                {
                    "id": name,
                    "title": item.get("title") or item.get("prompt") or name,
                    "state": item.get("state", ""),
                    "updateTime": item.get("updateTime", ""),
                    "source_id": source_id,
                }
            )
        return sessions

    async def list_activities(self, session_id: str) -> list[dict[str, Any]]:
        """List chat activities (messages, plans, MCP calls) of a session."""
        path = f"/{session_id}/activities" if not session_id.startswith("/") else f"{session_id}/activities"
        data = await self._request("GET", path, params={"pageSize": 100})
        if not isinstance(data, dict) or "activities" not in data:
            _LOGGER.warning(
                "Jules API activities response for %s has unexpected shape (keys: %s, body: %.300s)",
                session_id,
                list(data.keys()) if isinstance(data, dict) else type(data).__name__,
                str(data),
            )
        messages = []
        for item in data.get("activities", []) or []:
            originator = item.get("originator", "agent")

            if "message" in item:
                parts = (item.get("message", {}) or {}).get("parts", []) or []
                text = "\n".join(
                    p.get("text", "") for p in parts if isinstance(p, dict) and p.get("text")
                ).strip()
                if text:
                    messages.append(
                        {"role": "user" if originator == "user" else "jules", "kind": "message", "text": text}
                    )

            elif "userInput" in item:
                ui = item.get("userInput")
                if isinstance(ui, str):
                    text = ui.strip()
                else:
                    parts = (ui or {}).get("parts", []) or []
                    text = "\n".join(
                        p.get("text", "") for p in parts if isinstance(p, dict) and p.get("text")
                    ).strip()
                if text:
                    messages.append({"role": "user", "kind": "message", "text": text})

            elif "planGenerated" in item:
                plan = (item.get("planGenerated", {}) or {}).get("plan", {}) or {}
                steps = plan.get("steps", []) or []
                titles = [
                    (s.get("title") or s.get("prompt") or "").strip()
                    for s in steps
                    if isinstance(s, dict) and (s.get("title") or s.get("prompt"))
                ]
                if titles:
                    text = "\n".join(f"{i + 1}. {t}" for i, t in enumerate(titles))
                    messages.append({"role": "jules", "kind": "plan", "text": text})

            elif "artifacts" in item:
                files = set()
                adds = dels = 0
                for a in item.get("artifacts", []) or []:
                    patch = (
                        (((a or {}).get("changeSet") or {}).get("gitPatch") or {}).get("unidiffPatch")
                        or ""
                    )
                    for line in patch.splitlines():
                        if line.startswith("diff --git ") and " b/" in line:
                            f = line.rsplit(" b/", 1)[-1].strip()
                            if f and "__pycache__" not in f and not f.endswith(".pyc"):
                                files.add(f)
                        elif line.startswith("+") and not line.startswith("+++"):
                            adds += 1
                        elif line.startswith("-") and not line.startswith("---"):
                            dels += 1
                messages.append({
                    "role": "system", "kind": "changes", "files": sorted(files),
                    "adds": adds, "dels": dels, "time": item.get("createTime", ""),
                })

            elif "progressUpdated" in item:
                pu = item.get("progressUpdated")
                text = ""
                if isinstance(pu, dict):
                    text = str(pu.get("progress") or pu.get("description") or pu.get("title") or pu.get("text") or "").strip()
                elif isinstance(pu, str):
                    text = pu.strip()
                if text:
                    messages.append({"role": "jules", "kind": "progress", "text": text})

            elif "mcpCall" in item:
                call = item.get("mcpCall", {}) or {}
                label = call.get("tool") or call.get("name") or "MCP Call"
                messages.append({"role": "jules", "kind": "mcp", "text": label})

            elif "state" in item:
                state = (item.get("state", {}) or {}).get("state", "")
                if state:
                    messages.append(
                        {"role": "system", "kind": "state", "text": str(state).replace("_", " ").title()}
                    )

            # progressUpdated and other no-content activities are skipped

        # Collapse runs of artifacts activities into a single row with the
        # final file set, and drop rows without files.
        collapsed: list[dict[str, Any]] = []
        for m in messages:
            if m.get("kind") == "changes" and collapsed and collapsed[-1].get("kind") == "changes":
                collapsed[-1]["files"] = m["files"]
            else:
                collapsed.append(m)
        result = []
        for m in collapsed:
            if m.get("kind") == "changes":
                if not m.get("files"):
                    continue
                m["text"] = "Изменения кода: " + ", ".join(m["files"][:6])
            result.append(m)

        if not result and isinstance(data, dict) and data.get("activities"):
            first = data["activities"][0]
            _LOGGER.warning(
                "Jules activities: %d items but nothing parsed for %s; first item keys: %s; body: %.500s",
                len(data["activities"]),
                session_id,
                list(first.keys()) if isinstance(first, dict) else type(first).__name__,
                str(first),
            )
        return result

    async def get_session(self, session_id: str) -> dict[str, Any]:
        """Fetch session details (branch, PR link) if the API exposes them."""
        data = await self._request("GET", f"/{session_id}")
        branch = pr_url = None
        if isinstance(data, dict):
            git = data.get("gitInfo") or {}
            if isinstance(git, dict):
                branch = git.get("currentBranch")
            branch = branch or data.get("currentBranch") or data.get("branch")
            pr_obj = data.get("pullRequest") or {}
            if isinstance(pr_obj, dict):
                pr_url = pr_obj.get("url")
        return {"branch": branch, "pr_url": pr_url}

    async def send_message(self, session_id: str, text: str) -> None:
        """Send a user message to a session."""
        path = f"/{session_id}:sendMessage"
        await self._request(
            "POST",
            path,
            json={"message": {"parts": [{"text": text}]}},
        )

    async def create_session(self, source_id: str, prompt: str) -> dict[str, Any]:
        """Create a new session (task) for a codebase."""
        payload: dict[str, Any] = {"prompt": prompt}
        if source_id:
            payload["sourceContext"] = {"sources": [{"source": source_id}]}
        data = await self._request("POST", "/sessions", json=payload)
        return {"id": data.get("name", ""), "title": data.get("title") or prompt, "state": data.get("state", "")}
