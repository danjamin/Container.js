// Container.js 
(function(window, Object, Function, undefined) {
    // Create _the_ container instance
    var c = new Container();

    // ContainerAware with access to the container instance "c"
    function ContainerAware() {
        this.container = c;
    }
    // Expose ContainerAware
    window.ContainerAware = ContainerAware;

    /**
     * The Container class.
     */
    function Container() {
        this.items = {};
    }

    /**
     * Sets an item in the container.
     * If "value" is a function, it will get executed with the container instance as the first argument.
     * It then stores the resulting value in the container.
     * 
     * @param {string} key The key to store the value under. Good idea to prefix (e.g. 'mycompany.some_value')
     * @param {mixed} value The value to store, could be anything. See above if value is a function.
     * @throws {string} When trying to set window as a dependency
     */
    Container.prototype.set = function(key, value) {
        // if (value === window) {
        //     throw 'Cannot set the window as a dependency! Do you want infinite containers?'; 
        // }

        // if it's a function, we need to inject the container
        if (Object.prototype.toString.call(value) === '[object Function]') {
            value = value(this);
        }
        this.items[key] = value;
    };

    /**
     * Gets an item out of the container by key.
     * 
     * @param {string} key The key of the item to get from the container.
     * @return {mixed} Whatever value was stored under this key
     * @throws {string} when key is not present
     */
    Container.prototype.get = function(key) {
        if (this.items.hasOwnProperty(key)) {
            return this.items[key];
        } else {
            throw 'Dependency "' + key + '" not found in Container';
        }
    };


    /**
     * Parses a "containerfile" JSON object
     * @param {object} items
     */
    window.Containerfile = function(items) {
        var key;
        var value;

        for (key in items) {
            value = items[key];
            c.set(key, value);
        }
    };

    /**
     * Extends the Function prototype with a Service method.
     * This method enables converting the class context into a Service in the container.
     * To prevent duplicate Service invocations AND to expose the service name, the property
     * "Service" is set to the value of "key" at the end of this method.
     * 
     * @param {string} key The key of the service.
     * @param {array} depedencyKeys The keys of the dependencies of this item.
     * @return {object} The class instance (context).
     */
    Function.prototype.Service = function(key, depedencyKeys) {
        // preserve the context under klass
        var klass = this;
        var dependencies = [];
        var i, max_i;

        // if some JERK doesn't follow the rules, let them list out the dependencies
        if (Object.prototype.toString.call(depedencyKeys) !== '[object Array]') {
            // slice at 1 to ignore the 'key' argument
            depedencyKeys = Array.prototype.slice.call(arguments, 1);
        }

        // Add the service to the container, under the appropriate 'key'
        c.set(key, function(c) {
            var createKlass;
            var F;

            // Get the needed dependencies
            for (i = 0, max_i = depedencyKeys.length; i < max_i; ++i) {
                dependencies.push(c.get(depedencyKeys[i]));
            }

            // This is the "module pattern"
            // used to dynamically instantiate a new object with dynamic arguments
            // http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            createKlass = (function() {
                function F(args) {
                    return klass.apply(this, args);
                }
                F.prototype = klass.prototype;

                return function(args) {
                    return new F(args);
                }
            })();

            return createKlass(dependencies);
        });

        // Override this method with the key!
        klass.Service = key;

        return klass;
    };

    // Expose container to the Event object
    Event.prototype.container = c;

})(window, Object, Function);