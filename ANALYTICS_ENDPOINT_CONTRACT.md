# Private analytics endpoint contract

## Scope

The public site sends one best-effort `POST` request after the page load.

`https://hits.andkamau.com/v1/page-view`

The request has this JSON body:

```json
{"path":"/"}
```

The request uses no cookies and no credentials. The browser may send a standard `Referer` header. The browser does not send a visitor identifier. The request timeout is 1.5 seconds. A failed request has no effect on the site.

## Required endpoint behavior

1. Accept only `POST /v1/page-view`.
2. Limit the body to 256 bytes.
3. Accept only the `path` field.
4. Normalize `path` as a path without query or fragment data.
5. Return `204 No Content` with `Cache-Control: no-store`.
6. Send `Access-Control-Allow-Origin: https://andkamau.com`.
7. Send no `Access-Control-Allow-Credentials` header.
8. Apply an IP-based rate limit in memory at the trusted reverse proxy.
9. Do not log request IP addresses or raw user-agent strings.

## Required stored row

Store only these fields:

| Field | Source |
| --- | --- |
| `received_at_utc` | Server UTC clock |
| `country_code` | Local GeoIP lookup from the request IP |
| `device_type` | Coarse result: `desktop`, `mobile`, `tablet`, or `other` |
| `browser_family` | Coarse result, such as `Chrome`, `Safari`, `Firefox`, `Edge`, or `Other` |
| `referrer` | Parsed `Referer` header when present; remove query and fragment data |
| `path` | Normalized request path when reporting needs it |

Use the request IP only in memory. Do not store it. Do not hash it. Do not send it to another service. Use forwarded client-IP headers only from named, trusted reverse-proxy addresses.

## Privacy and operations

1. Run the endpoint as a separate unprivileged account.
2. Keep the database, reports, and backups outside the public web root.
3. Require owner authentication for reports and dashboards.
4. Do not provide a public read endpoint or data export.
5. Set reverse-proxy, application, and monitoring logs to omit client IP and raw user-agent fields.
6. Enforce a storage cap and return `503` without writing when the cap is reached.
7. Delete rows older than 12 months in a scheduled job.
8. Expire exports and backups on the same 12-month schedule.
9. Test database, report, and backup content for IP addresses and raw user-agent strings before release.

## Missing dependency

No local GeoIP database or lookup tool is installed in the inspected environment. The endpoint needs a locally stored country database, such as the MaxMind GeoLite2 Country `.mmdb` database, plus its compatible lookup library. The production owner must create the required MaxMind account and license key to download and update that database. Automate database updates. Delete the old database within 30 days of a new release. Do not place that key in this repository or in chat.

## Count limits

These are page-view requests, not unique visitors. Blockers, bots, failed requests, retries, and network conditions can change the count. The endpoint cannot promise to measure every visit.
