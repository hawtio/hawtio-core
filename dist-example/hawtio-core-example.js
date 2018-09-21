var Section1;
(function (Section1) {
    Section1.section1Page1Component = {
        template: "\n      <h1>Section 1 - Page 1</h1>\n      <p><a ng-href=\"section1/page2\">Go to Page 2</a></p>\n    "
    };
})(Section1 || (Section1 = {}));
var Section1;
(function (Section1) {
    Section1.section1Page2Component = {
        template: "\n      <h1>Section 1 - Page 2</h1>\n      <p><a ng-href=\"section1/page2/details\">Go to Details</a></p>\n    "
    };
})(Section1 || (Section1 = {}));
var Section1;
(function (Section1) {
    Section1.section1Page2DetailsComponent = {
        template: "\n      <h1>Section 1 - Page 2</h1>\n      <p>Details</p>\n      <p><a ng-href=\"section1/page2\">Back</a></p>\n    "
    };
})(Section1 || (Section1 = {}));
var Section1;
(function (Section1) {
    var Section1Controller = /** @class */ (function () {
        function Section1Controller() {
            this.tabs = [
                new Nav.HawtioTab('Page 1', '/section1/page1'),
                new Nav.HawtioTab('Page 2', '/section1/page2')
            ];
        }
        return Section1Controller;
    }());
    Section1.Section1Controller = Section1Controller;
    Section1.section1Component = {
        template: '<hawtio-tabs-layout tabs="$ctrl.tabs"></hawtio-tabs-layout>',
        controller: Section1Controller
    };
})(Section1 || (Section1 = {}));
var Section1;
(function (Section1) {
    var Section1Service = /** @class */ (function () {
        Section1Service.$inject = ["$q"];
        function Section1Service($q) {
            'ngInject';
            this.$q = $q;
            this.state = null;
        }
        Section1Service.prototype.init = function () {
            var _this = this;
            return this.$q(function (resolve, reject) {
                console.log('section1: initializing...');
                setTimeout(function () {
                    _this.state = true;
                    console.log('section1: initialized');
                    resolve();
                }, 1000);
            });
        };
        Section1Service.prototype.isValid = function () {
            if (this.state === null) {
                throw Error("state hasn't been initialized yet");
            }
            return this.state;
        };
        return Section1Service;
    }());
    Section1.Section1Service = Section1Service;
})(Section1 || (Section1 = {}));
/// <reference path="section1.service.ts"/>
var Section1;
(function (Section1) {
    configureRoutes.$inject = ["$routeProvider"];
    configureHelp.$inject = ["helpRegistry", "$templateCache"];
    configureLayout.$inject = ["mainNavService", "section1Service"];
    registerInitFunction.$inject = ["initService", "section1Service"];
    function configureRoutes($routeProvider) {
        'ngInject';
        $routeProvider
            .when('/section1/page1', { template: '<section1-page1></section1-page1>' })
            .when('/section1/page2', { template: '<section1-page2></section1-page2>' })
            .when('/section1/page2/details', { template: '<section1-page2-details></section1-page2-details>' });
    }
    Section1.configureRoutes = configureRoutes;
    function configureHelp(helpRegistry, $templateCache) {
        'ngInject';
        var key = 'help/section1.md';
        helpRegistry.addUserDoc('section1', key);
        $templateCache.put(key, '## Section 1\n\nTest documentation for Section 1\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na\n\na');
    }
    Section1.configureHelp = configureHelp;
    function configureLayout(mainNavService, section1Service) {
        'ngInject';
        mainNavService.addItem({
            title: 'Section 1',
            basePath: '/section1',
            template: '<section1></section1>',
            isValid: function () {
                console.log('section1: ' + (section1Service.isValid() ? 'valid' : 'invalid'));
                return section1Service.isValid();
            }
        });
    }
    Section1.configureLayout = configureLayout;
    function registerInitFunction(initService, section1Service) {
        'ngInject';
        initService.registerInitFunction(function () {
            return section1Service.init();
        });
    }
    Section1.registerInitFunction = registerInitFunction;
})(Section1 || (Section1 = {}));
/// <reference path="section1-page1.component.ts"/>
/// <reference path="section1-page2.component.ts"/>
/// <reference path="section1-page2-details.component.ts"/>
/// <reference path="section1.component.ts"/>
/// <reference path="section1.config.ts"/>
/// <reference path="section1.service.ts"/>
var Section1;
(function (Section1) {
    Section1.module = angular.module('example-section1', [])
        .config(Section1.configureRoutes)
        .run(Section1.configureHelp)
        .run(Section1.configureLayout)
        .run(Section1.registerInitFunction)
        .component('section1', Section1.section1Component)
        .component('section1Page1', Section1.section1Page1Component)
        .component('section1Page2', Section1.section1Page2Component)
        .component('section1Page2Details', Section1.section1Page2DetailsComponent)
        .service('section1Service', Section1.Section1Service)
        .name;
})(Section1 || (Section1 = {}));
var Section2;
(function (Section2) {
    Section2.section2omponent = {
        template: "\n      <h1>Section 2</h1>\n    "
    };
})(Section2 || (Section2 = {}));
var Section2;
(function (Section2) {
    var Section2Service = /** @class */ (function () {
        Section2Service.$inject = ["$q"];
        function Section2Service($q) {
            'ngInject';
            this.$q = $q;
            this.state = null;
        }
        Section2Service.prototype.init = function () {
            var _this = this;
            return this.$q(function (resolve, reject) {
                console.log('section2: initializing...');
                setTimeout(function () {
                    _this.state = true;
                    console.log('section2: initialized');
                    resolve();
                }, 2000);
            });
        };
        Section2Service.prototype.isValid = function () {
            if (this.state === null) {
                throw Error("state hasn't been initialized yet");
            }
            return this.state;
        };
        return Section2Service;
    }());
    Section2.Section2Service = Section2Service;
})(Section2 || (Section2 = {}));
/// <reference path="section2.service.ts"/>
var Section2;
(function (Section2) {
    configureRoutes.$inject = ["$routeProvider"];
    configureHelp.$inject = ["helpRegistry", "$templateCache"];
    configureLayout.$inject = ["mainNavService", "section2Service"];
    registerInitFunction.$inject = ["initService", "section2Service"];
    function configureRoutes($routeProvider) {
        'ngInject';
        $routeProvider
            .when('/section2', { template: '<section2></section2>' });
    }
    Section2.configureRoutes = configureRoutes;
    function configureHelp(helpRegistry, $templateCache) {
        'ngInject';
        var key = 'help/section2.md';
        helpRegistry.addUserDoc('section2', key);
        $templateCache.put(key, '## Section 2\n\nTest documentation for Section 2\n');
    }
    Section2.configureHelp = configureHelp;
    function configureLayout(mainNavService, section2Service) {
        'ngInject';
        mainNavService.addItem({
            title: 'Section 2',
            href: '/section2',
            isValid: function () {
                console.log('section2: ' + (section2Service.isValid() ? 'valid' : 'invalid'));
                return section2Service.isValid();
            },
            rank: 1
        });
    }
    Section2.configureLayout = configureLayout;
    function registerInitFunction(initService, section2Service) {
        'ngInject';
        initService.registerInitFunction(function () {
            return section2Service.init();
        });
    }
    Section2.registerInitFunction = registerInitFunction;
})(Section2 || (Section2 = {}));
/// <reference path="section2.component.ts"/>
/// <reference path="section2.config.ts"/>
/// <reference path="section2.service.ts"/>
var Section2;
(function (Section2) {
    Section2.module = angular.module('example-section2', [])
        .config(Section2.configureRoutes)
        .run(Section2.configureHelp)
        .run(Section2.configureLayout)
        .run(Section2.registerInitFunction)
        .component('section2', Section2.section2omponent)
        .service('section2Service', Section2.Section2Service)
        .name;
})(Section2 || (Section2 = {}));
var Section3;
(function (Section3) {
    Section3.section3omponent = {
        template: "\n      <h1>Section 3</h1>\n    "
    };
})(Section3 || (Section3 = {}));
var Section3;
(function (Section3) {
    var Section3Service = /** @class */ (function () {
        Section3Service.$inject = ["$q"];
        function Section3Service($q) {
            'ngInject';
            this.$q = $q;
            this.state = null;
        }
        Section3Service.prototype.init = function () {
            var _this = this;
            return this.$q(function (resolve, reject) {
                console.log('section3: initializing...');
                setTimeout(function () {
                    _this.state = false;
                    console.log('section3: initialized');
                    resolve();
                }, 1500);
            });
        };
        Section3Service.prototype.isValid = function () {
            if (this.state === null) {
                throw Error("state hasn't been initialized yet");
            }
            return this.state;
        };
        return Section3Service;
    }());
    Section3.Section3Service = Section3Service;
})(Section3 || (Section3 = {}));
/// <reference path="section3.service.ts"/>
var Section3;
(function (Section3) {
    configureRoutes.$inject = ["$routeProvider"];
    configureHelp.$inject = ["helpRegistry", "$templateCache"];
    configureLayout.$inject = ["mainNavService", "section3Service"];
    registerInitFunction.$inject = ["initService", "section3Service"];
    function configureRoutes($routeProvider) {
        'ngInject';
        $routeProvider
            .when('/section3', { template: '<section3></section3>' });
    }
    Section3.configureRoutes = configureRoutes;
    function configureHelp(helpRegistry, $templateCache) {
        'ngInject';
        var key = 'help/section3.md';
        helpRegistry.addUserDoc('section3', key);
        $templateCache.put(key, '## Section 3\n\nTest documentation for Section 3\n');
    }
    Section3.configureHelp = configureHelp;
    function configureLayout(mainNavService, section3Service) {
        'ngInject';
        mainNavService.addItem({
            title: 'Section 3',
            href: '/section3',
            isValid: function () {
                console.log('section3: ' + (section3Service.isValid() ? 'valid' : 'invalid'));
                return section3Service.isValid();
            }
        });
    }
    Section3.configureLayout = configureLayout;
    function registerInitFunction(initService, section3Service) {
        'ngInject';
        initService.registerInitFunction(function () {
            return section3Service.init();
        });
    }
    Section3.registerInitFunction = registerInitFunction;
})(Section3 || (Section3 = {}));
/// <reference path="section3.component.ts"/>
/// <reference path="section3.config.ts"/>
/// <reference path="section3.service.ts"/>
var Section3;
(function (Section3) {
    Section3.module = angular.module('example-section3', [])
        .config(Section3.configureRoutes)
        .run(Section3.configureHelp)
        .run(Section3.configureLayout)
        .run(Section3.registerInitFunction)
        .component('section3', Section3.section3omponent)
        .service('section3Service', Section3.Section3Service)
        .name;
})(Section3 || (Section3 = {}));
/// <reference path="section1/section1.module.ts"/>
/// <reference path="section2/section2.module.ts"/>
/// <reference path="section3/section3.module.ts"/>
var Example;
(function (Example) {
    Example.exampleModule = angular.module('example', [
        Section1.module,
        Section2.module,
        Section3.module
    ])
        .name;
    hawtioPluginLoader.addModule(Example.exampleModule);
})(Example || (Example = {}));
