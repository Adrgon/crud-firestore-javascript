const db = firebase.firestore()

const task_form = document.getElementById('task-form');
const task_container = document.getElementById('task-container');

let editStatus = false;
let id = '';


const sabeTask = (title, description) =>{
    db.collection('tasks').doc().set({
        title,
        description
    })
}

const getTasks = ()=> db.collection('tasks').get();
const getTask = (id) => db.collection('tasks').doc(id).get();
const onGetTasks = (callback)=> db.collection('tasks').onSnapshot(callback);
const deleteTask = (id)=>db.collection('tasks').doc(id).delete();
const updateTask = (id, updateTask)=>db.collection('tasks').doc(id).update(updateTask);

document.addEventListener('DOMContentLoaded', async (e)=>{
    //const querySnapshot = await getTasks();

    onGetTasks( (querySnapshot)=>{
        console.log(querySnapshot)
        task_container.innerHTML = '';
        querySnapshot.forEach(doc=> {
            console.log(doc.data);
            const task = doc.data()
            task.id = doc.id
            task_container.innerHTML += `<div class='card card-body mt-2 border-primery'>
            <h3 class='h5'>${task.title}<h3>
            <p>${task.description}</p>
            <div>
                <button class='btn btn-danger btn-delete' data-id="${task.id}" >Delete</button>
                <button class='btn btn-secondary btn-edit' data-id="${task.id}" >Edit</button>
            </div>
            </div>`;

            const btnsDelete= document.querySelectorAll('.btn-delete');
            btnsDelete.forEach( (btn) => {
                btn.addEventListener('click', async (e)=>{
                    //console.log(e.target.dataset.id);
                    await deleteTask(e.target.dataset.id);
                })
            })


            const btnsEdit= document.querySelectorAll('.btn-edit');
            btnsEdit.forEach( (btn) => {
                btn.addEventListener('click', async (e)=>{
                    //console.log(e.target.dataset.id);
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();
                    //console.log(task);

                    editStatus = true;
                    id = doc.id;
                    task_form['task-title'].value = task.title
                    task_form['task-description'].value = task.description
                    task_form['btn-task-form'].textContent = 'Update';
                })
            })
        })
    })
});


task_form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    //console.log('enviando');

    const title = task_form['task-title'];
    const description = task_form['task-description'];

    if(!editStatus) {
        await sabeTask(title.value, description.value)
    } else {
        await updateTask(id, 
            {
                title: title.value, 
                description: description.value
            })
            editStatus = false;
            task_form['btn-task-form'].textContent = 'Save';
            id='';

    }

    //console.log(title, description);

    task_form.reset();
    title.focus()

})