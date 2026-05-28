const API_URL = "http://localhost:5000/api";


// REGISTER
const registerForm =
    document.getElementById("registerForm");

if(registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const username =
                document.getElementById("username").value;

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            try {

                const response = await fetch(
                    `${API_URL}/auth/register`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            email,
                            password
                        })

                    }
                );

                const data =
                    await response.json();

                alert(data.message);

                if(response.ok) {

                    window.location.href =
                        "login.html";

                }

            } catch(error) {

                console.log(error);

                alert("Registration Failed");

            }

        }
    );

}


// LOGIN
const loginForm =
    document.getElementById("loginForm");

if(loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const email =
                document.getElementById("loginEmail").value;

            const password =
                document.getElementById("loginPassword").value;

            try {

                const response = await fetch(
                    `${API_URL}/auth/login`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })

                    }
                );

                const data =
                    await response.json();

                if(data.token) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    alert("Login Successful");

                    window.location.href =
                        "dashboard.html";

                } else {

                    alert(data.message);

                }

            } catch(error) {

                console.log(error);

                alert("Login Failed");

            }

        }
    );

}


// CREATE POST
const postForm =
    document.getElementById("postForm");

if(postForm) {

    postForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const title =
                document.getElementById("title").value;

            const content =
                document.getElementById("content").value;

            const token =
                localStorage.getItem("token");

            try {

                const response = await fetch(
                    `${API_URL}/posts`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                token

                        },

                        body: JSON.stringify({
                            title,
                            content
                        })

                    }
                );

                const data =
                    await response.json();

                alert(data.message);

                document
                    .getElementById("postForm")
                    .reset();

                loadPosts();

            } catch(error) {

                console.log(error);

                alert("Post Creation Failed");

            }

        }
    );

}


// LOAD POSTS
async function loadPosts() {

    const postsContainer =
        document.getElementById("posts");

    if(!postsContainer) return;

    try {

        const response =
            await fetch(`${API_URL}/posts`);

        const posts =
            await response.json();

        postsContainer.innerHTML = "";

        posts.forEach((post) => {

            postsContainer.innerHTML += `

                <div class="post">

                    <h2>${post.title}</h2>

                    <p>${post.content}</p>

                    <small>
                        Author:
                        ${post.author?.username || "Unknown"}
                    </small>

                    <br><br>

                    <button
                        class="edit-btn"
                        onclick="editPost(
                            '${post._id}',
                            '${post.title}',
                            '${post.content}'
                        )">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deletePost('${post._id}')">

                        Delete

                    </button>

                    <div id="comments-${post._id}">
                    </div>

                    <div class="comment-box">

                        <input
                            type="text"
                            id="input-${post._id}"
                            class="comment-input"
                            placeholder="Write comment">

                        <button
                            class="comment-btn"
                            onclick="addComment('${post._id}')">

                            Add

                        </button>

                    </div>

                </div>

            `;

            loadComments(post._id);

        });

    } catch(error) {

        console.log(error);

    }

}


// ADD COMMENT
async function addComment(postId) {

    const comment =
        document.getElementById(
            `input-${postId}`
        ).value;

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/comments`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        token

                },

                body: JSON.stringify({
                    comment,
                    postId
                })

            }
        );

        const data =
            await response.json();

        alert(data.message);

        loadComments(postId);

    } catch(error) {

        console.log(error);

    }

}


// LOAD COMMENTS
async function loadComments(postId) {

    try {

        const response = await fetch(
            `${API_URL}/comments/${postId}`
        );

        const comments =
            await response.json();

        const commentsContainer =
            document.getElementById(
                `comments-${postId}`
            );

        commentsContainer.innerHTML = "";

        comments.forEach((comment) => {

            commentsContainer.innerHTML += `

                <div class="comment">

                    <strong>
                        ${comment.user?.username}
                    </strong>

                    <p>${comment.comment}</p>

                </div>

            `;

        });

    } catch(error) {

        console.log(error);

    }

}


// EDIT POST
async function editPost(id, oldTitle, oldContent) {

    const title =
        prompt("Edit Title", oldTitle);

    const content =
        prompt("Edit Content", oldContent);

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/posts/${id}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        token

                },

                body: JSON.stringify({
                    title,
                    content
                })

            }
        );

        const data =
            await response.json();

        alert(data.message);

        loadPosts();

    } catch(error) {

        console.log(error);

    }

}


// DELETE POST
async function deletePost(id) {

    const confirmDelete =
        confirm("Are you sure?");

    if(!confirmDelete) return;

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/posts/${id}`,
            {

                method: "DELETE",

                headers: {

                    "Authorization":
                        token

                }

            }
        );

        const data =
            await response.json();

        alert(data.message);

        loadPosts();

    } catch(error) {

        console.log(error);

    }

}


// LOAD POSTS WHEN PAGE OPENS
window.onload = () => {

    loadPosts();

};