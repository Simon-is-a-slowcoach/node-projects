function _clonedObjectWithoutProperties(oriObj, ...keys) {
    const clonedOjb = Object.assign(Object.create(Object.getPrototypeOf(oriObj)), oriObj);
    for (const key of keys) {
        delete clonedOjb[key];
    }
    return clonedOjb;
}

exports._clonedObjectWithoutProperties = _clonedObjectWithoutProperties;
