# CoCreate-validation

A simple validation component in vanilla javascript. Easily configured using HTML5 attributes and/or JavaScript API. Take it for a spin in our [playground!](https://CoCreateJS.com/docs/validation)

![min file size in bytes](https://img.badgesize.io/https://cdn.CoCreateJS.com/validation/latest/CoCreate-validation.min.js?style=flat-square&label=minified&color=orange)
![gzip file size in bytes](https://img.badgesize.io/https://cdn.CoCreateJS.com/validation/latest/CoCreate-validation.min.js?compression=gzip&style=flat-square&label=gzip&color=yellow)
![brotlifile size in bytes](https://img.badgesize.io/https://cdn.CoCreateJS.com/validation/latest/CoCreate-validation.min.js?compression=brotli&style=flat-square&label=brotli)
![GitHub latest release](https://img.shields.io/github/v/release/CoCreateJS/validation?style=flat-square)
![GitHub](https://img.shields.io/github/license/CoCreateJS/validation?style=flat-square)
![GitHub](https://img.shields.io/static/v1?style=flat-square&label=&message=Hiring&color=blueviolet)

![CoCreate-validation](https://cdn.CoCreateJS.com/docs/CoCreate-validation.gif)

## [Docs & Demo](https://CoCreateJS.com/docs/validation)

For a complete guide and working demo refer to the [doumentation](https://CoCreateJS.com/docs/validation)

## CDN

```html
<script src="https://cdn.CoCreateJS.com/validation/latest/CoCreate-validation.min.js"></script>
```

```html
<script src="https://cdn.CoCreateJS.com/validation/latest/CoCreate-validation.min.css"></script>
```

## NPM

```shell
$ npm i @cocreate/validation
```

## yarn

```shell
$ yarn install @cocreate/validation
```

# Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Announcements](#announcements)
-   [Roadmap](#roadmap)
-   [How to Contribute](#how-to-contribute)
-   [About](#about)
-   [License](#license)

<a name="announcements"></a>

# Announcements

All updates to this library are documented in our [CHANGELOG](https://github.com/CoCreateJS/validation/blob/master/CHANGELOG.md) and [releases](https://github.com/CoCreateJS/validation/releases). You may also subscribe to email for releases and breaking changes.

<a name="roadmap"></a>

# Roadmap

If you are interested in the future direction of this project, please take a look at our open [issues](https://github.com/CoCreateJS/validation/issues) and [pull requests](https://github.com/CoCreateJS/validation/pulls). We would love to hear your feedback.

<a name="about"></a>

# About

CoCreate-validation is guided and supported by the CoCreate Developer Experience Team.

Please Email the Developer Experience Team [here](mailto:develop@CoCreateJS.com) in case of any queries.

CoCreate-validation is maintained and funded by CoCreate. The names and logos for CoCreate are trademarks of CoCreate, LLC.

<a name="contribute"></a>

# How to Contribute

We encourage contribution to our libraries (you might even score some nifty swag), please see our [CONTRIBUTING](https://github.com/CoCreateJS/validation/blob/master/CONTRIBUTING.md) guide for details.

We want this library to be community-driven, and CoCreate led. We need your help to realize this goal. To help make sure we are building the right things in the right order, we ask that you create [issues](https://github.com/CoCreateJS/validation/issues) and [pull requests](https://github.com/CoCreateJS/validation/pulls) or merely upvote or comment on existing issues or pull requests.

We appreciate your continued support, thank you!

<a name="license"></a>

# License

This software is dual-licensed under the GNU Affero General Public License version 3 (AGPLv3) and a commercial license.

-   **Open Source Use**: For open-source projects and non-commercial use, this software is available under the AGPLv3. The AGPLv3 allows you to freely use, modify, and distribute this software, provided that all modifications and derivative works are also licensed under the AGPLv3. For the full license text, see the [LICENSE file](https://github.com/CoCreateJS/validation/blob/master/LICENSE).

-   **Commercial Use**: For-profit companies and individuals intending to use this software for commercial purposes must obtain a commercial license. The commercial license is available when you sign up for an API key on our [website](https://CoCreateJS.com). This license permits proprietary use and modification of the software without the copyleft requirements of the AGPLv3. It is ideal for integrating this software into proprietary commercial products and applications.

If you have not purchased a commercial license and intend to use this software for commercial purposes, you are required to sign up for an API key on our website.


### Action lifecycle and native constraints

Use `actions="disabled, validate, save, disabled"` to disable the button while
validating and saving, then explicitly enable it on success. Validation failure
or an exception calls `action.abort()`, which releases a button disabled by that
chain. Validation success calls `action.end()` and continues the chain.

Native controls use the browser constraint validation API for `required`, input
types, `pattern`, ranges, and other supported constraints. Custom messages set
with `element.setCustomValidity(message)` are preserved; clear them with
`element.setCustomValidity("")` when resolved. Fields with `aria-errormessage` display errors in their referenced elements.
Without a valid target, errors render into `template="notification"` and the first
invalid native field reports its browser message.
Disabled controls and controls barred from native validation are skipped.
`novalidate` on the form or `formnovalidate` on the action element skips the native
checks; explicitly configured CoCreate rules still run.

Custom `matches` validators are awaited. A `valid="false"` value marks the
element invalid; `valid="true"` passes this rule. Validation writes its
combined result to `validation` and `aria-invalid`. Use native `required`,
`type="email"`, `pattern`, and `minlength`/`maxlength` attributes for browser
constraints; the custom `email`, `subdomain`, and `length` attributes have been
removed. Non-native elements need their own custom validation.
Each validator registered in `validations` receives its matching elements and
returns an array of failed elements (or nothing on success). Results are combined
so one passing rule cannot erase another rule's failure. `validation` and
`aria-invalid` reflect the combined result. Non-native elements can still use
CoCreate attributes and `getValue()`. `validate(selector)` scopes validation to
the matching elements and their descendants.

### Inline field errors

```html
<label for="email">Email</label>
<input id="email" type="email" required aria-errormessage="email-error" />
<span id="email-error" hidden></span>
```

Native and CoCreate validation messages use this same explicit relationship.
Validation reveals the target and updates `aria-invalid`; successful revalidation
clears and hides the message. `aria-describedby` help text is left intact.
Messages are inserted as text, not HTML. Linked errors do not also generate a
notification. Missing targets fall back to notifications.

Custom validators may accept a second `report` callback and call
`report({ data: [{ type: "rule", status: "error", success: false,
message: "Explain the error", elements: failedElements }] })` before returning
`failedElements`. The action collects these reports and presents the first
reported error per field after all rules finish.
