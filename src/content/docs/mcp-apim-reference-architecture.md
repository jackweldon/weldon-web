# Exposing enterprise APIs as MCP servers through Azure APIM

**Slug:** `weldonweb.co.uk/mcp-apim-reference-architecture`
**Meta description:** A reference architecture for exposing enterprise REST APIs as Model Context Protocol servers through Azure API Management. Two production patterns, the Terraform shape, and the decisions behind each one.

Model Context Protocol is the thing AI agents use to call tools. If you're putting agents in front of your enterprise systems, your existing REST APIs need to speak MCP — or something in front of them does.

I spent a few weeks building a proper reference setup for this on Azure, using API Management as the front door. This post is the architecture and the reasoning. The deeper technical write-ups (gotchas, platform constraints, the Claude Code workflow that built it) are coming over the next few weeks.

## Why APIM and not a dedicated AI gateway

Short version: your enterprise already runs an API gateway. It already handles auth, rate limiting, audit, key rotation, network isolation, observability. Your security team already signed off on it.

Adding MCP as another protocol it speaks is a much smaller change than standing up a parallel "AI gateway" stack that does all the same governance work again, badly, with worse compliance posture and a separate procurement conversation.

Some AI gateway products do add genuinely new capability — semantic guardrails, model routing, prompt caching. Fine. Those can sit alongside. The core governance layer is solved and shouldn't be rebuilt.

For Azure shops the answer is APIM.

## The two patterns

There are two ways to expose MCP through APIM, and you'll probably want both depending on the API.

**Pattern 1: REST-as-MCP.** APIM synthesises an MCP interface from an existing REST API using standard XML inbound policies and Liquid templates to translate JSON-RPC payloads into native REST calls. You define which operations become MCP tools, APIM handles the protocol translation, and your backend service doesn't change. Best for APIs you already own and don't want to modify — typical enterprise integration work.

**Pattern 2: Governing an existing MCP server.** You have (or build) a dedicated MCP server — in my case a .NET 9 service — and put APIM in front of it for auth, rate limiting, and observability. Best when the tools need logic that doesn't map cleanly to existing REST endpoints, or when you want a clear separation between "agent surface" and "system of record."

Real deployments use both. Stable CRUD APIs get exposed via Pattern 1. Anything that needs orchestration, session state, or composition across multiple backends becomes a Pattern 2 server.

## What sits where

**APIM at the front:**
* Entra ID token validation for tool calls (with context propagation to the backend via On-Behalf-Of flow)
* Rate limiting per session or per consumer
* Audit logging through Application Insights
* Network isolation via Private Endpoints
* Policy fragments for the cross-cutting concerns

**The .NET MCP server (Pattern 2) handles:**
* Tool registration and discovery
* Session state
* Keep-alive frames for Azure Load Balancer (more on this in a later post — it matters)
* Backend orchestration

Terraform everywhere, deployable end to end. The MCP control plane bits need `azapi` rather than `azurerm` for now — the native resource doesn't exist yet — but it's clean enough.

## Baseline APIM Policy

Here is a baseline Entra ID validation policy for the front door to get you started:

```xml
<policies>
    <inbound>
        <base />
        <validate-jwt header-name="Authorization" failed-validation-httpcode="401" require-scheme="Bearer">
            <openid-config url="[https://login.microsoftonline.com/](https://login.microsoftonline.com/){{tenant-id}}/v2.0/.well-known/openid-configuration" />
            <audiences>
                <audience>{{api-client-id}}</audience>
            </audiences>
            <issuers>
                <issuer>[https://sts.windows.net/](https://sts.windows.net/){{tenant-id}}/</issuer>
            </issuers>
        </validate-jwt>
    </inbound>
</policies> 
``` 
## Authorisation: Products, not Workspaces

One thing worth flagging upfront because it affects your design: APIM Workspaces don't support MCP yet. If you're using Workspaces for multi-team isolation, you'll be using Products as the authorisation unit for MCP instead. Not a blocker, just plan for it.

## What's coming next

Six things I want to write up properly over the next few weeks:

- Undocumented platform behaviours to watch out for
- Platform constraints worth knowing before you start
- Why the API gateway is the right control plane for AI agents (the longer argument)
- How Claude Code did most of the implementation work
- Where this fits in the broader agent governance story
- A productised version of the engagement, for teams who want help running this in their own tenant

## If you're thinking about this

If your team is looking at MCP, agent governance, or AI infrastructure on Azure and you want to talk through the architecture — DM me on LinkedIn or drop me a line through the contact page. Happy to compare notes whether or not it ever becomes an engagement.

**Contact:** jack@weldonweb.co.uk