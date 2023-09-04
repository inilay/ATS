"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anchor = exports.Line = exports.Side = exports.Score = exports.Team = exports.StyledMatch = exports.BottomText = exports.TopText = exports.Wrapper = void 0;
var styled_components_1 = require("styled-components");
exports.Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: stretch;\n  height: 100%;\n  font-family: ", ";\n"], ["\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: stretch;\n  height: 100%;\n  font-family: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.fontFamily;
});
exports.TopText = styled_components_1.default.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  margin-bottom: 0.2rem;\n  min-height: 1.25rem;\n"], ["\n  color: ", ";\n  margin-bottom: 0.2rem;\n  min-height: 1.25rem;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.textColor.dark;
});
exports.BottomText = styled_components_1.default.p(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n  flex: 0 0 none;\n  text-align: center;\n  margin-top: 0.2rem;\n  min-height: 1.25rem;\n"], ["\n  color: ", ";\n  flex: 0 0 none;\n  text-align: center;\n  margin-top: 0.2rem;\n  min-height: 1.25rem;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.textColor.dark;
});
exports.StyledMatch = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  justify-content: space-between;\n"], ["\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  justify-content: space-between;\n"])));
exports.Team = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
exports.Score = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  height: 100%;\n  padding: 0 1rem;\n  align-items: center;\n  width: 20%;\n  justify-content: center;\n  background: ", ";\n  color: ", ";\n"], ["\n  display: flex;\n  height: 100%;\n  padding: 0 1rem;\n  align-items: center;\n  width: 20%;\n  justify-content: center;\n  background: ", ";\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme, won = _a.won;
    return won ? theme.score.background.wonColor : theme.score.background.lostColor;
}, function (_a) {
    var theme = _a.theme, won = _a.won;
    return won ? theme.textColor.highlighted : theme.textColor.dark;
});
exports.Side = styled_components_1.default.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: flex;\n  height: 100%;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 0 0 1rem;\n  background: ", ";\n  :first-of-type {\n    border-top-right-radius: 2px;\n    border-top-left-radius: 2px;\n    border-top-width: 2px;\n  }\n  :last-of-type {\n    border-bottom-right-radius: 2px;\n    border-bottom-left-radius: 2px;\n    border-bottom-width: 2px;\n  }\n  border-right: 2px solid ", ";\n  border-left: 2px solid ", ";\n  border-top: 2px solid ", ";\n  border-bottom: 2px solid ", ";\n  transition: border-color 0.5s ", ";\n  ", " {\n    color: ", ";\n  }\n  ", " {\n    color: ", ";\n  }\n  ", "\n"], ["\n  display: flex;\n  height: 100%;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 0 0 1rem;\n  background: ", ";\n  :first-of-type {\n    border-top-right-radius: 3px;\n    border-top-left-radius: 3px;\n    border-top-width: 2px;\n  }\n  :last-of-type {\n    border-bottom-right-radius: 3px;\n    border-bottom-left-radius: 3px;\n    border-bottom-width: 2px;\n  }\n  border-right: 4px solid ", ";\n  border-left: 4px solid ", ";\n  border-top: 1px solid ", ";\n  border-bottom: 1px solid ", ";\n  transition: border-color 0.5s ", ";\n  ", " {\n    color: ", ";\n  }\n  ", " {\n    color: ", ";\n  }\n  ", "\n"])), function (_a) {
    var theme = _a.theme, won = _a.won;
    return won ? theme.matchBackground.wonColor : theme.matchBackground.lostColor;
}, function (_a) {
    var theme = _a.theme;
    return theme.border.color;
}, function (_a) {
    var theme = _a.theme;
    return theme.border.color;
}, function (_a) {
    var theme = _a.theme;
    return theme.border.color;
}, function (_a) {
    var theme = _a.theme;
    return theme.border.color;
}, function (_a) {
    var theme = _a.theme;
    return theme.transitionTimingFunction;
}, exports.Team, function (_a) {
    var theme = _a.theme, won = _a.won;
    return won ? theme.textColor.highlighted : theme.textColor.dark;
}, exports.Score, function (_a) {
    var theme = _a.theme, won = _a.won;
    return won ? theme.textColor.highlighted : theme.textColor.dark;
}, function (_a) {
    var hovered = _a.hovered, theme = _a.theme, won = _a.won;
    return hovered && (0, styled_components_1.css)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      border-color: ", ";\n      ", " {\n        color: ", ";\n      }\n      ", " {\n        color: ", ";\n      }\n    "], ["\n      border-color: ", ";\n      ", " {\n        color: ", ";\n      }\n      ", " {\n        color: ", ";\n      }\n    "])), theme.border.highlightedColor, exports.Team, theme.textColor.highlighted, exports.Score, won
        ? theme.score.text.highlightedWonColor
        : theme.score.text.highlightedLostColor);
});
exports.Line = styled_components_1.default.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  height: 0px;\n  transition: border-color 0.5s ", ";\n  border-width: 0px;\n  border-style: solid;\n  border-color: ", ";\n"], ["\n  height: 1px;\n  transition: border-color 0.5s ", ";\n  border-width: 1px;\n  border-style: solid;\n  border-color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.smooth;
}, function (_a) {
    var highlighted = _a.highlighted, theme = _a.theme;
    return highlighted ? theme.border.highlightedColor : theme.border.color;
});
exports.Anchor = styled_components_1.default.a(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  font-family: ", ";\n  font-weight: ", ";\n  color: ", ";\n  font-size: ", ";\n  line-height: 1.375rem;\n  text-decoration: none;\n  cursor: pointer;\n  &:hover {\n    text-decoration: underline;\n  }\n"], ["\n  font-family: ", ";\n  font-weight: ", ";\n  color: ", ";\n  font-size: ", ";\n  line-height: 1.375rem;\n  text-decoration: none;\n  cursor: pointer;\n  &:hover {\n    text-decoration: underline;\n  }\n"])), function (props) {
    return props.font ? props.font : props.theme.fontFamily;
}, function (props) { return (props.bold ? '700' : '400'); }, function (props) { return props.theme.textColor.main; }, function (props) { return (props.size ? props.size : '1rem'); });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
