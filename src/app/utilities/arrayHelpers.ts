namespace ArrayHelpers {

    /**
     * Removes elements in the target array based on the new collection, returns true if
     * any changes were made
     */
    export function removeElements(collection:Array<any>, newCollection:Array<any>, index:string = 'id') {
      var oldLength = collection.length;
      _.remove(collection, (item) => !_.some(newCollection, (c:any) => c[index] === item[index]));
      return collection.length !== oldLength;
    }

    /**
     * Changes the existing collection to match the new collection to avoid re-assigning
     * the array pointer, returns true if the array size has changed
     */
    export function sync(collection:Array<any>, newCollection:Array<any>, index:string = 'id') {
      var answer = removeElements(collection, newCollection, index);
      if (newCollection) {
        newCollection.forEach((item) => {
          var oldItem = _.find(collection, (c) => { return c[index] === item[index]; });
          if (!oldItem) {
            answer = true;
            collection.push(item);
          } else {
            if (item !== oldItem) {
              angular.copy(item, oldItem);
              answer = true;
            }
          }
        });
      }
      return answer;
    }

}
