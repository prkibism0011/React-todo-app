import React from 'react';
import 'bulma/css/bulma.css';

export default class Task extends React.Component{
    constructor(props){
        super(props);

        this.state={
            tasks:[],
            doneTasks:[],
            ongoingTasks:[],

            modalTaskForm: false,
            modalTaskForm_Toggle:'',

            title:'',
            detail:'',
            time:'',
            ongoing: false,

            act:0,
            index:0,
            renderTasks:1,
            navActive:'tasks'
        };
    }

    //making unique id for every tasks
    uniqueId=()=>{
        return 'id-' + Math.random().toString(36).substr(2,16);
    }

    //handling modal tasks
    modalTaskForm=(modal)=>{
        if(modal){
            this.setState({modalTaskForm_Toggle: 'is-active', modalTaskForm:modal});
        }
        else{
            this.setState({modalTaskForm_Toggle: '', modalTaskForm:modal});
        }
    }

    //submit task & update task
    submitTask=(e)=>{
        e.preventDefault();
        console.log('submit');

        let{ tasks, tittle, detail, time, ongoing, act, index } = this.state;
        if(act === 0){
            let task = {
                tittle, detail, time, ongoing, id: this.uniqueId()
            };
            tasks.push(task);
        }
        else{
            if(tittle){tasks[index].tittle = tittle;}
            
            tasks[index].detail = detail;
            tasks[index].time = time;
        }

        this.setState({
            tasks,
            modakTaskForm:false,
            modalTaskForm_Toggle:'',

            //reset form
            tittle:'',
            detail:'',
            time:'',
            ongoing: false,
            act:0
        });
    }

    //handleinputchange for every input text
    inputChange=(e)=>{
        let{ name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    //delete task
    remove=(i)=>{
        let { tasks } = this.state;
        tasks.splice(i, 1);
        this.setState({
            tasks,

            //reset form
            tittle:'',
            detail:'',
            time:'',
            ongoing: false,
            act:0
        });
    }

    //edit task
    edit=(i)=>{
        let task = this.state.tasks[i];

        this.setState({
            tittle: task.tittle,
            detail: task.detail,
            time: task.time,
            modalTaskForm: true,
            modalTaskForm_Toggle: 'is-active',
            act:1,
            index:1
        });
    }

    viewDateTime=(dt)=>{
        dt = dt.split('T');

        let options = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
        let d = new Date(dt[0]);
        let n = d.toLocaleDateString(['en-US'], options);

        return  `${n} @${dt[1]}`
    }

    //DONE TASKS
    taskDone=(i)=>{
        let { doneTasks, tasks } = this.state;
        
        //insert
        doneTasks.push(tasks[i]);

        //delete from task
        tasks.splice(i,1);
        this.setState({
            doneTasks, tasks
        });
    }

    removeDone=(i)=>{
        let { doneTasks } = this.state;
        //del from done task
        doneTasks.splice(i,1);
        this.setState({doneTasks});
    }

    unDone=(i)=>{
        let { doneTasks, tasks } = this.state;

        //insert
        tasks.push(doneTasks[i]);

        //remove from done task
        this.removeDone(i);
    }

    //ongoing
    tasksToOngo=(i,id)=>{
        let {tasks, ongoingTasks} = this.state;
        if(tasks[i].ongoing === false){
            //update task
            tasks[i].ongoing = true;
            //insert ongoing task
            ongoingTasks.push(tasks[i]);
        }
        else{
            //update task
            tasks[i].ongoing = false;
            //del ongoing task
            ongoingTasks.splice(ongoingTasks.findIndex(e => e.id === id), 1);
        }
        this.setState({
            ongoingTasks,
            tasks
        });
    }

    doneToOngo = (i,id) => {
        let {doneTasks, ongoingTasks} = this.state;
        if(doneTasks[i].ongoing === false){
            doneTasks[i].ongoing = true;
            ongoingTasks.push(doneTasks[i]);
        }
        else{
            doneTasks[i].ongoing = false;
            ongoingTasks.splice(ongoingTasks.findIndex(e => e.id === id), 1);
        }
        this.setState({
            ongoingTasks,
            doneTasks
        });
    }

    removeOngoing = (i,id) => {
        let {ongoingTasks, tasks, doneTasks} = this.state;
        ongoingTasks.splice(i,1);

        try{
            tasks[tasks.findIndex(e => e.id === id)].ongoing = false;
        }catch(error){
            console.log('not found in tasks');
        }
        this.setState({
            ongoingTasks,
            tasks,
            doneTasks
        });
    }

    render(){
        let  {tasks, doneTasks, ongoingTasks, renderTasks, modalTaskForm_Toggle, modalTaskForm, tittle, detail, time, navActive} = this.state;
        return(
            <React.Fragment>
                <div className="App" style={{paddingTop:20}}>
                        <div className="container">
                                <div className="field has-addons">
                                        <p className="control">
                                                <a className="button is-link is-rounded"
                                                    onClick={()=>this.modalTaskForm(!modalTaskForm)}
                                                >
                                                        <span className="icon">
                                                                <i class="fas fa-plus"></i>
                                                        </span>
                                                        <span>New</span>
                                                        {/* <span>Left</span> */}
                                                </a>
                                        </p>
                                        <p className="control">
                                                <a className={`button is-link ${navActive==='tasks'?'is-outlined':''}`}
                                                    onClick={()=>{
                                                        this.setState({
                                                            renderTasks:1, navActive: 'tasks'
                                                        });
                                                    }}
                                                >
                                                        <span className="icon">
                                                                <i class="fa fa-tasks"></i>
                                                        </span>
                                                        <span>Tasks ( {tasks.length} ) </span>
                                                </a>
                                        </p>
                                        <p className="control">
                                                <a className={`button is-link ${navActive==='done'?'is-outlined':''}`}
                                                    onClick={()=>{
                                                        this.setState({
                                                            renderTasks:2, navActive: 'done'
                                                        });
                                                    }}
                                                >
                                                        <span className="icon">
                                                                <i class="fa fa-check"></i>
                                                        </span>
                                                        <span>Done ( {doneTasks.length} ) </span>
                                                </a>
                                        </p>
                                        <p className="control">
                                                <a className={`button is-link ${navActive==='done'?'is-outlined':''} is-rounded`}
                                                         onClick={()=>{
                                                            this.setState({
                                                                renderTasks:3, navActive: 'ongoing'
                                                            });
                                                        }}
                                                >
                                                        <span className="icon">
                                                                <i class="fas fa-spinner fa-pulse"></i>
                                                        </span>
                                                        <span>Ongoing ( {ongoingTasks.length} ) </span>
                                                </a>
                                        </p>
                                </div>

                                {/* todo list */}
                                <div style={{paddingTop: 60}}>
                                    {//TASKS
                                        renderTasks===1 &&
                                        tasks.map((data,i)=>
                                            <article className="media" key={i}>
                                                    <div className="media-content">
                                                            <div className="content">
                                                                    <p>
                                                                        <strong>{data.tittle}</strong>
                                                                        <br />
                                                                        
                                                                        
                                                                        {data.detail}
                                                                    </p>
                                                            </div>
                                                            <nav className="level is-mobile">
                                                                <div className="level-left">
                                                                    <a className="level-item" onClick={()=>this.taskDone(i)}>
                                                                        <span className="icon"><i className="fa fa-check"></i></span>
                                                                    </a>
                                                                    <a className="level-item" onClick={()=>this.edit(i)}>
                                                                        <span className="icon"><i className="fa fa-edit"></i></span>
                                                                    </a>
                                                                    <a className="level-item" onClick={()=>this.tasksToOngo(i,data.id)}>
                                                                        <span className={`icon ${data.fav===true&&'has-text-danger'}`}><i className="fas fa-exclamation-triangle"></i></span>
                                                                    </a>
                                                                    <small>{this.viewDateTime(data.time)}</small>
                                                                </div>
                                                            </nav>
                                                    </div>
                                                    <div className="media-right">
                                                        <button className="delete"
                                                            onClick={()=>this.remove(i)}
                                                        ></button>
                                                    </div>
                                            </article>
                                        )
                                    }
                                    {//DONE
                                        renderTasks===2 &&
                                        doneTasks.map((data,i)=>
                                            <article className="media" key={i}>
                                                    <div className="media-content">
                                                            <div className="content">
                                                                    <p>
                                                                        <strong>{data.tittle}</strong>
                                                                        <br />
                                                                        
                                                                        
                                                                        {data.detail}
                                                                    </p>
                                                            </div>
                                                            <nav className="level is-mobile">
                                                                <div className="level-left">
                                                                    <a className="level-item" onClick={()=>this.unDone(i)}>
                                                                        <span className="icon"><i className="fa fa-undo"></i></span>
                                                                    </a>
                                                                    
                                                                    <a className="level-item" onClick={()=>this.doneToOngo(i,data.id)}>
                                                                        <span className={`icon ${data.fav===true&&'has-text-danger'}`}><i className="fas fa-exclamation-triangle"></i></span>
                                                                    </a>
                                                                    <small>{this.viewDateTime(data.time)}</small>
                                                                </div>
                                                            </nav>
                                                    </div>
                                                    <div className="media-right">
                                                        <button className="delete"
                                                            onClick={()=>this.removeDone(i)}
                                                        ></button>
                                                    </div>
                                            </article>
                                        )
                                    }
                                    {//ONGOING
                                        renderTasks===3 &&
                                        ongoingTasks.map((data,i)=>
                                            <div className="columns" key={i}>
                                                <div className="column is-12">
                                                    <article className="media" key={i}>
                                                        <div className="media-content">
                                                                <div className="content">
                                                                        <p>
                                                                            <strong>{data.tittle}</strong>
                                                                            <br />
                                                                            <small>{this.viewDateTime(data.time)}</small>
                                                                            
                                                                            {data.detail}
                                                                        </p>
                                                                </div>
                                                                
                                                        </div>
                                                        <div className="media-right">
                                                            <button className="delete"
                                                                onClick={()=>this.removeOngoing(i, data.id)}
                                                            ></button>
                                                        </div>
                                                    </article>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                        </div>
                        {/* MODALTASKFORM */}
                        <div className={`modal ${modalTaskForm_Toggle}`}>
                                <div className="modal-background" onClick={()=>this.modalTaskForm(!modalTaskForm)}></div>
                                <div className="modal-content">
                                        <form ref="myForm" className="myForm">
                                                <div className="field">
                                                        <label className="label" style={{color:'#fff'}}>Title</label>
                                                        <div className="control">
                                                            <input className="input" type="text" value={tittle} name="tittle"
                                                                onChange={(e)=>this.inputChange(e)}
                                                            />
                                                        </div>
                                                </div>
                                                <div className="field">
                                                        <label className="label" style={{color:'#fff'}}>Description</label>
                                                        <div className="control">
                                                            <textarea className="textarea" type="text" value={detail} name="detail"
                                                                onChange={(e)=>this.inputChange(e)}
                                                            />
                                                        </div>
                                                </div>
                                                <div className="field">
                                                        <label className="label" style={{color:'#fff'}}>Time</label>
                                                        <div className="control">
                                                            <input className="input" type="datetime-local" value={time} name="time"
                                                                onChange={(e)=>this.inputChange(e)}
                                                            />
                                                        </div>
                                                </div>
                                                <button className="button is-info" onClick={(e)=>this.submitTask(e)}>
                                                        SAVE
                                                </button>
                                        </form>
                                </div>
                                <button className="modal-close is-large" aria-label="close" onClick={()=>this.modalTaskForm(!modalTaskForm)}></button>
                        </div>
                </div>
            </React.Fragment>
        );
    }
}