### Change Log

#### 3.2.15
* Improve `AuthService`

#### 3.2.14
* Fix `AuthService.logout()`

#### 3.2.13
* Put back `AuthService` and deprecate `UserDetails` class name

#### 3.2.12
* Consolidate login/logout functions into `UserDetails` and discontinue `AuthService`.
  Now you can use `postLoginTasks`/`preLogoutTasks`/`postLogoutTasks` services to
  enhance login/logout behaviours.

#### 3.2.11
* Add `PreBootstrapTask` type to `PluginLoader`

#### 3.2.10

* Add exponential backoff to navigation config pulling

#### 3.2.10

* Pull navigation config when no default nav is available

#### 3.2.8
* Make `PluginLoader` more type-friendly
* Add minimal plugin example

...

#### 2.0.7
* Comment out console hijacking

#### 2.0.6
* Stub out some core services

#### 2.0.5
* re-enable html 5 mode 

#### 2.0.4
* Removed angular-route

#### 2.0.3
* Load scripts before bootstrapping
* Exclude webcomponents polyfill from karma.conf.js

#### 2.0.2
* temporarily disable html5mode

#### 2.0.0
* Initial spike of hawtio-core
