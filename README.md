# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Call api
Toutes les actions
http://localhost:1337/api/single-actions

config : 
/api/configurations/1?populate=*

page content : 
/api/${params.page}?locale=${params.lang}&populate=deep

page with slug : 
http://localhost:1337/api/single-actions?filters[slug][$eq]=federer-test-fr&locale=fr

filtre par  domaine : 
http://localhost:1337/api/single-actions?filters[domaine][$contains]=action&locale=en

requete single-action avec langues dans data
/api/single-actions/{id}?populate=*

lien pour google doc events
https://docs.google.com/spreadsheets/d/1v4YCZZTr-FEasGT0nLaCcfadfF8EXj8S/edit?gid=1819074687#gid=1819074687
