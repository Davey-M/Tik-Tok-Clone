class Tag
{
    constructor(name, eventhandler, event)
    {
        this.name = name;

        this.class = name;

        this.DOM = document.getElementsByClassName(this.class);

        for (let i = 0; i < this.DOM.length; i++)
        {
            this.DOM[i].addEventListener(this.eventhandler, this.event);
        }
    }

    insert(parent)
    {
        parent.insertAdjacentHTML('beforeend', `<${this.name} class="${this.class}" ></${this.name}>`)

        this.DOM = document.getElementsByClassName(this.class);
    }
}

const test = new Tag('test', 'click', () => {console.log('Hello From Test')});

test.insert(document.body);

test.DOM[0].insertAdjacentText('beforeend', 'Hello')