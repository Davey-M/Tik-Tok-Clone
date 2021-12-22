class Post
{
    constructor(username, user_nickname, content, tags, likes, shares, comments)
    {
        this.username = username;
        this.user_nickname = user_nickname;
        this.content = content;
        this.tags = tags;
        this.likes = likes ?? 0;
        this.shares = shares ?? 0;
        this.comments = comments ?? 0;

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
            <div class="pic"></div>
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
            <div class="fourth">
                <b class="follow_button">Follow</b>
            </div>
        </div>
        `
    }
}

const content = document.getElementById('page_content');

function pushPost(post)
{
    content.insertAdjacentHTML('beforeend', post.html);
}

for (let i = 0; i < 10; i++)
{
    (async () => {
        let words = await fetch('https://random-word-api.herokuapp.com/word?number=4&swear=0');
        let data = await words.json();
        
        let thisPost = new Post(data[0], data[1], data[2], [data[3]], Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000));
        pushPost(thisPost);
    })()
}