namespace Core {

  export class HawtioExtension {

    private _registeredExtensions = {};

    add(extensionPointName: string, fn: any): void {
      if (!this._registeredExtensions[extensionPointName]) {
        this._registeredExtensions[extensionPointName] = [];
      }
      this._registeredExtensions[extensionPointName].push(fn);
    }

    render(extensionPointName: string, element: any, scope: any): void {
      let fns = this._registeredExtensions[extensionPointName];
      if (!fns) {
        return;
      }

      for (let i = 0; i < fns.length; i++) {
        let toAppend = fns[i](scope);
        if (!toAppend) {
          return;
        }
        if (typeof toAppend == "string") {
          toAppend = document.createTextNode(toAppend);
        }
        element.append(toAppend);
      }
    }
  
  }

}