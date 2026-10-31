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
        for item in data.get("sources", []) or []:
            name = item.get("name", "")
            gh = item.get("githubRepo", {}) or {}
            owner, repo_name = gh.get("owner", ""), gh.get("name", "")
            repo = "/".join(str(p) for p in (owner, repo_name) if p)
            if not repo and repo_name and "/" in str(repo_name):
                repo = str(repo_name)
            sources.append(
                {
                    "id": name,
                    "title": item.get("title") or repo or name,
                    "repo": repo or item.get("title") or name,
                    "branch": gh.get("defaultBranch", "main") if isinstance(gh, dict) else "main",
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
                for a in item.get("artifacts", []) or []:
                    patch = (
                        (((a or {}).get("changeSet") or {}).get("gitPatch") or {}).get("unidiffPatch")
                        or ""
                    )
                    for line in patch.splitlines():
                        if line.startswith("diff --git ") and " b/" in line:
                            files.add(line.rsplit(" b/", 1)[-1].strip())
                label = "Изменения кода: " + ", ".join(sorted(files)[:6])
                messages.append({"role": "system", "kind": "changes", "text": label})

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

        if not messages and isinstance(data, dict) and data.get("activities"):
            first = data["activities"][0]
            _LOGGER.warning(
                "Jules activities: %d items but nothing parsed for %s; first item keys: %s; body: %.500s",
                len(data["activities"]),
                session_id,
                list(first.keys()) if isinstance(first, dict) else type(first).__name__,
                str(first),
            )
        return messages

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
