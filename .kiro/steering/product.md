# Product overview

Edge Terminal — security monitoring management platform based on RuoYi-Vue (v3.8.5).

## Purpose

Manage edge devices (cameras, access control, sensors), alarm records, people tracking, and live monitoring for physical security deployments. Includes AI report generation via a DeepSeek-compatible LLM API.

## Core features

- Device management (cameras, access control, sensors, audio)
- Alarm monitoring and records
- People management
- Real-time data dashboard (DataV)
- Map integration (Mapbox GL JS)
- MQTT real-time messaging
- AI reports (SSE streaming via OpenAI-compatible API)
- Task scheduling and process management
- System admin (users, roles, menus, dictionary, config)

## Deployment targets

- Linux edge devices (primary)
- Windows environments
- Nginx reverse proxy with `/prod-api` to the Java backend

## Internationalization

English (`en`, default) and Chinese (`zh`) via vue-i18n; preference stored in cookie `language`.
