# tabloom

Reusable React Native / Expo table primitives extracted from wooftech.

## Exports

- `Table`
- `Row`
- `Header`
- `Column`

## Usage

```jsx
import {Column, Header, Row, Table} from "tabloom"
```

Use React Native primitives and styles, including when running with `react-native-web`.

## Example app

A full Expo example app is available in `example/`.

```bash
cd example
npm install
npm run web
```

## System tests

System tests are placed in `spec/system` and use `velocious` + `system-testing`.

```bash
npm install
npm run test:dist
```

`test:dist` builds the example web app into `dist/` and runs browser-driven system tests against it.
