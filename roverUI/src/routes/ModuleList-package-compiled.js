'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FourOhFour = require('./FourOhFour');

var _FourOhFour2 = _interopRequireDefault(_FourOhFour);

var _Overview = require('./overview/Overview');

var _Overview2 = _interopRequireDefault(_Overview);

var _Resources = require('./resources/Resources');

var _Resources2 = _interopRequireDefault(_Resources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// grouping modules into a nice package ;)
// remember any "Routed Page" must export all dependent modules it uses inside its container
exports.default = { FourOhFour: _FourOhFour2.default, Overview: _Overview2.default, Resources: _Resources2.default };

//# sourceMappingURL=ModuleList-package-compiled.js.map