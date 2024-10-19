/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "unit-allowed-list": ["em", "rem", "vh", "vw", "%", "px"],
  },
};
