let users = {};
let follow_buttons;

const content = document.getElementById('page_content');
const following_accounts = document.getElementById('following_accounts');
const suggested = document.getElementById('suggested');

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
            return data;
        }

        this.html = `
        <div class="card">
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
                    <div class="post_content">
                        <p>
                            ${this.content}
                        </p>
                    </div>
                </div>
            </div>
            <div class="reactions">
                <b class="follow_button" user="${this.id}" id="${this.id}" >Follow</b>
                <div class="react_holder">
                    <div class="reaction">
                        <div class="circle"></div>
                        <b>${this.likes}</b>
                    </div>
                    <div class="reaction">
                        <div class="circle"></div>
                        <b>${this.comments}</b>
                    </div>
                    <div class="reaction">
                        <div class="circle"></div>
                        <b>${this.shares}</b>
                    </div>    
                </div>
            </div>
        </div>
        `
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
        <div class="account_card">
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

        follow_button.innerText = 'Following';

        following_accounts.insertAdjacentHTML('afterend', user.card);
    })

    // console.log(follow_buttons);
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
}

for (let i = 0; i < 5; i++)
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