let users = {};
let follow_buttons;

const content = document.getElementById('page_content');
const following_accounts = document.getElementById('following_accounts');
const suggested = document.getElementById('suggested');
const discover_section = document.getElementById('discover_section');
const nav_buttons = document.getElementById('nav_buttons').children;
const searchBar = document.getElementById('search');
let cards;
let cardHeight;
let followingView = false;

let cardsList = {};

class Post
{
    constructor(username, user_nickname, content, tags, likes, shares, comments, picture)
    {
        this.id = Math.floor(Math.random() * 8999) + 1000;
        this.user = new User(username, user_nickname, this.id, picture);
        this.username = username;
        this.user_nickname = user_nickname;
        this.content = content;
        this.tags = tags;
        this.likes = likes ?? 0;
        this.shares = shares ?? 0;
        this.comments = comments ?? 0;

        this.picture = picture ?? '';

        this.tagString = () => {
            let data = '';
            for (let tag of this.tags)
            {
                data += `<span class="tag" >#${tag}</span>`
            }
            if (discover_section.children.length < 15)
            {
                discover_section.insertAdjacentHTML('afterbegin', data);
            }
            return data;
        }

        this.html = `
        <div class="card" id="card_${this.id}">
            <div class="pic" style="background-image: ${this.picture}"></div>
            <div class="post">
                <div class="row">
                    <b>${this.username}</b>
                    <p class="nickname">${this.user_nickname}</p>
                </div>
                <div class="row">
                    <p class="hash">${this.tagString()}</p>
                </div>
                <div class="row">
                    <div class="post_content" style="background: linear-gradient(
                        ${Math.floor(Math.random() * 360)}deg,
                        rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}) 0%,
                        rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}) 100%
                        );">
                        <p>
                            ${this.content}
                        </p>
                    </div>
                </div>
            </div>
            <div class="reactions">
                <b class="follow_button" user="${this.id}" id="${this.id}" >Follow</b>
                <div class="react_holder">
                    <div class="reaction" liked="false" onclick="changeCount(this)">
                        <div class="circle" style="background-image: url(heart.png);"></div>
                        <b>${this.likes}</b>
                    </div>
                    <div class="reaction" liked="false">
                        <div class="circle" style="background-image: url(comment.png);"></div>
                        <b>${this.comments}</b>
                    </div>
                    <div class="reaction" liked="false">
                        <div class="circle" style="background-image: url(share.png);"></div>
                        <b>${this.shares}</b>
                    </div>    
                </div>
            </div>
        </div>
        `

        cardsList[`card_${this.id}`] = this;
    }
}

class User
{
    constructor(username, nickname, id, picture)
    {
        this.username = username;
        this.nickname = nickname;
        this.id = id ?? (Math.floor(Math.random() * 8999) + 1000);

        users[this.id] = this;

        this.card = `                    
        <div class="account_card" id="${this.id}" onclick="
            if (document.getElementById('card_${this.id}'))
            {
                window.scroll(0, (window.scrollY + document.getElementById('card_${this.id}').getBoundingClientRect().y) - 80);
            }
        ">
            <div class="pic" style="background-image: ${picture};"></div>
            <div class="names">
                <p class="username">${this.username}</p>
                <p class="nickname">${this.nickname}</p>
            </div>
        </div>
        `
    }
}

function setupFollowing(id)
{
    let follow_button = document.getElementById(id);

    follow_button.addEventListener('click', () => {
        let fid = parseInt(follow_button.getAttribute('user'));
        let user = users[fid];

        follow_button.innerText = follow_button.innerText === 'Following' ? 'Follow' : 'Following';

        if (follow_button.innerText === 'Following')
        {
            following_accounts.insertAdjacentHTML('afterend', user.card);
        }
        else
        {
            document.getElementById(fid).remove();
        }
    })
}

function changeCount(e)
{
    if (e.getAttribute('liked') === 'false')
    {
        e.setAttribute('liked', 'true')
        e.children[1].textContent = parseInt(e.children[1].textContent) + 1;
        e.children[0].style.backgroundColor = 'var(--red)';
    }
    else
    {
        e.setAttribute('liked', 'false')
        e.children[1].textContent = parseInt(e.children[1].textContent) - 1;
        e.children[0].style.backgroundColor = 'var(--off-white)';
    }
}


function pushPost(post)
{
    content.insertAdjacentHTML('beforeend', post.html);
}

async function addCard()
{
    let words = await fetch('https://random-word-api.herokuapp.com/word?number=4&swear=0');
    let data = await words.json();
    
    let thisPost = new Post(
        data[0], 
        data[1], 
        data[2], 
        [data[3]], 
        Math.floor(Math.random() * 1000), 
        Math.floor(Math.random() * 1000), 
        Math.floor(Math.random() * 1000), 
        `url(https://picsum.photos/${Math.floor(Math.random() * 50) + 100})`
    );

    pushPost(thisPost);

    setupFollowing(thisPost.id);   

    cards = document.getElementsByClassName('card');
    cardHeight = cards[0].getBoundingClientRect().height;
}

function showFollowing()
{
    for (let n of nav_buttons)
    {
        n.classList.remove('selected');
    }
    for (let i = 0; i < cards.length; i++)
    {
        let c = cards[i];

        if (c.getElementsByClassName('follow_button')[0].innerText === 'Following')
        {
            c.style.display = '';
        }
        else
        {
            c.style.display = 'none';
        }
    }
}

function showForYou()
{
    for (let n of nav_buttons)
    {
        n.classList.remove('selected');
    }
    for (let i = 0; i < cards.length; i++)
    {
        let c = cards[i];

        c.style.display = '';
    }
}

function search(searcher)
{
    searcher.preventDefault();
    searchString = searcher.target.value;
    let filter = searchString.toUpperCase();
    
    for (let i = 0; i < cards.length; i++)
    {
        let c = cards[i];
        let cc = cardsList[c.id];
        if (filter === '')
        {
            c.style.display = '';
        }
        else if (
            cc.username.toUpperCase().indexOf(filter) > -1 ||
            cc.user_nickname.toUpperCase().indexOf(filter) > -1 ||
            cc.content.toUpperCase().indexOf(filter) > -1
        )
        {
            c.style.display = '';
        }
        else
        {
            c.style.display = 'none';
        }
    }
}

searchBar.addEventListener('input', search);


// Set up envoirment right away
for (let i = 0; i < 8; i++)
{
    (async () => {
        let words = await fetch('https://random-word-api.herokuapp.com/word?number=4&swear=0');
        let data = await words.json();
        
        let thisUser = new User(
            data[0], 
            data[1],
            undefined,
            `url(https://picsum.photos/${Math.floor(Math.random() * 50) + 100})`
        );
    
        suggested.insertAdjacentHTML('afterend', thisUser.card);
    })()
}

for (let i = 0; i < 5; i++)
{
    addCard();
}

let mostScrolled = 0;

window.addEventListener('scroll', () => {
    if (followingView === false && searchBar.value === '')
    {
        let scroll = Math.floor(window.scrollY / cardHeight);
        let cardAmount = document.getElementsByClassName('card').length;
    
        if (scroll > mostScrolled && scroll > cardAmount - 8)
        {
            mostScrolled = scroll;
            addCard()
        }
    }
})