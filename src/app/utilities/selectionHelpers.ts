/// <reference path="baseHelpers.ts"/>

namespace SelectionHelpers {

  const log: Logging.Logger = Logger.get("SelectionHelpers");

  // these functions deal with adding/using a 'selected' item on a group of objects
  export function selectNone(group: any[]): void {
    group.forEach((item: any): void => { item['selected'] = false; });
  }

  export function selectAll(group: any[], filter?: (any) => boolean): void {
    group.forEach((item: any): void => {
      if (!filter) {
        item['selected'] = true;
      } else {
        if (filter(item)) {
          item['selected'] = true;
        }
      }
    });
  }

  export function toggleSelection(item: any): void {
    item['selected'] = !item['selected'];
  }

  export function selectOne(group: any[], item: any): void {
    selectNone(group);
    toggleSelection(item);
  }

  export function sync(selections: any[], group: any[], index: string): any[] {
    group.forEach((item) => {
      item['selected'] = _.some(selections, (selection) => selection[index] === item[index]);
    });
    return _.filter(group, (item) => item['selected']);
  }

  export function select(group: any[], item: any, $event: any): void {
    let ctrlKey = $event.ctrlKey;
    if (!ctrlKey) {
      if (item['selected']) {
        toggleSelection(item);
      } else {
        selectOne(group, item);
      }
    } else {
      toggleSelection(item);
    }
  }

  export function isSelected(item: any, yes?: string, no?: string): any {
    return maybe(item['selected'], yes, no);
  }

  // these functions deal with using a separate selection array
  export function clearGroup(group: any): void {
    group.length = 0;
  }

  export function toggleSelectionFromGroup(group: any[], item: any, search?: (item: any) => boolean): void {
    let searchMethod = search || _.matches(item);
    if (_.some(group, searchMethod)) {
      _.remove(group, searchMethod);
    } else {
      group.push(item);
    }
  }

  function stringOrBoolean(str: string, answer: boolean): any {
    if (angular.isDefined(str)) {
      return str;
    } else {
      return answer;
    }
  }

  function nope(str?: string) {
    return stringOrBoolean(str, false);
  }

  function yup(str?: string) {
    return stringOrBoolean(str, true);
  }

  function maybe(answer: boolean, yes?: string, no?: string) {
    if (answer) {
      return yup(yes);
    } else {
      return nope(no);
    }
  }

  export function isInGroup(group: any[], item: any, yes?: string, no?: string, search?: (item: any) => boolean): any {
    if (!group) {
      return nope(no);
    }
    let searchMethod = search || _.matches(item);
    return maybe(_.some(group, searchMethod), yes, no);
  }

  export function filterByGroup(group: any, item: any, yes?: string, no?: string, search?: (item: any) => boolean): any {
    if (group.length === 0) {
      return yup(yes);
    }
    let searchMethod = search || item;
    if (angular.isArray(item)) {
      return maybe(_.intersection(group, item).length === group.length, yes, no);
    } else {
      return maybe(group.any(searchMethod), yes, no);
    }
  }

  export function syncGroupSelection(group: any, collection: any, attribute?: string) {
    let newGroup = [];
    if (attribute) {
      group.forEach((groupItem) => {
        let first = _.find(collection, (collectionItem) => {
          return groupItem[attribute] === collectionItem[attribute];
        });
        if (first) {
          newGroup.push(first);
        }
      });
    } else {
      group.forEach((groupItem) => {
        let first = _.find(collection, (collectionItem) => {
          return _.isEqual(groupItem, collectionItem);
        });
        if (first) {
          newGroup.push(first);
        }
      });
    }
    clearGroup(group);
    group.push(...newGroup);
  }

  export function decorate($scope) {
    $scope.selectNone = selectNone;
    $scope.selectAll = selectAll;
    $scope.toggleSelection = toggleSelection;
    $scope.selectOne = selectOne;
    $scope.select = select;
    $scope.clearGroup = clearGroup;
    $scope.toggleSelectionFromGroup = toggleSelectionFromGroup;
    $scope.isInGroup = isInGroup;
    $scope.viewOnly = false; // true=disable checkmarks
    $scope.filterByGroup = filterByGroup;
  }


}

