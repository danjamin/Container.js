# NOT MAINTAINED

# Container.js

A light weight container for JavaScript

## Usage

The container is intended to organize your code so that it is more testable.
The most common usage is to define classes as **Services** with injected dependencies.

```html
<html>

    <head>
        <title>Clothes Example (Container.js)</title>
        <script src="../src/Container.js" type="text/javascript"></script>
        <script src="../src/Containerfile.js" type="text/javascript"></script>
    </head>

    <body>
        <select id='outfit'>
            <option value="a blue dress">a blue dress</option>
            <option value="pants">pants</option>
            <option value="a sweatshirt">a sweatshirt</option>
        </select>
        <button id='show-outfit'>Show outfit</button>

        <script type="text/javascript">
            // Clothes.js
            Clothes.Service('clothes', 'document');
            function Clothes(document) {
                this.document = document;
            }
            Clothes.prototype.getOutfit = function() {
                var outfit = this.document.getElementById('outfit');
                return outfit.value;
            };

            // Person.js
            Person.Service('person', ['clothes']);
            function Person(clothes) {
                this.clothes = clothes;
            }
            Person.prototype.talkAboutOutfit = function() {
                alert('I am wearing ' + this.clothes.getOutfit() + '.');
            };       

            var showOutfitBtn = document.getElementById('show-outfit');
            showOutfitBtn.addEventListener('click', function(e) {
                var person = e.container.get('person');
                person.talkAboutOutfit();
            }, false);
        </script>

    </body>

</html>
```


## Implications

- Adds the **Service** method to the Function prototype
- Adds the **container** method to the Event prototype
- Adds the **Containerfile** method to the window
- Adds the **ContainerAware** class to the window that can be extended for access to the container
