import React , { useState }from 'react'
import axios from 'axios'
import Joi from 'joi'
import { useNavigate } from 'react-router-dom'

export  function Register() {
	const navigate = useNavigate()


	const [errList, setErrList] = useState(null)
	const [backEndErr, setBackEndErr] = useState(null)
	// const [isLoading, setIsLoading] = useState(null)
	const [user, setUser] = useState({
		"first_name":"",
		"last_name":"",
		"age":0,
		"email":"",
		"password":""
	})

	function getUser(e){
		setErrList(null)
		setBackEndErr(null)

		let userData= {...user}
		userData[e.target.name]=e.target.value;
		setUser(userData)
	}

	function validateUser(){
		const schema = Joi.object({
			first_name:Joi.string().alphanum().min(2).max(10).required() ,
			last_name: Joi.string().alphanum().min(2).max(10).required() ,
			age: Joi.number().min(12).max(100) ,
			email: Joi.string().email({ minDomainSegments: 2, tlds:false }).required(),
			password:Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
		})

		let {error} = schema.validate(user, {abortEarly:false});
		if(error){
			setErrList(error.details)
			// setIsLoading(false)
		}else{
			return true;
		}
		
	}


	async function sumbitForm(e){
		e.preventDefault();
		// setIsLoading(true)


		if(validateUser()){
	 		let {data} = await axios.post("https://route-egypt-api.herokuapp.com/signup",user)
			if(data.message ==="success"){
				navigate('/login')
			}else{
				setBackEndErr(data.message)
				// setIsLoading(false);
			}
		}
	}
	

	return <>
		<div className='registeration-form d-flex justify-content-center align-items-center'>
			<div className='container'>
				<h2 className='h1'>Registeration form</h2>

				{backEndErr?
					<div className='alert alert-danger p-2'>{backEndErr}
					</div>
				:''
				}

				{errList?.map( (err, idx)=>
				<div key={idx} className="alert alert-danger p-2">
					{err.message}
				</div> )}


				<form onSubmit={sumbitForm}>
					<label htmlFor="first_name" className='my-2 form-label'>First Name: </label>
					<input onChange={getUser} type="text" className=' mb-2 form-control'  id='first_name' name='first_name'/>

					<label htmlFor="last_name" className=' my-2 form-label'>Last Name: </label>
					<input onChange={getUser} type="text" className=' mb-2 form-control'   id='last_name' name='last_name'/>

					<label htmlFor="age" className=' my-2 form-label'>Age: </label>
					<input onChange={getUser} type="number" className=' mb-2 form-control'   id='age' name='age'/>

					<label htmlFor="email" className=' my-2 form-label'>Email: </label>
					<input onChange={getUser} type="email" className=' mb-2 form-control'   id='email' name='email'/>

					<label htmlFor="password" className=' my-2 form-label'>Password: </label>
					<input onChange={getUser} type="password" className=' mb-2 form-control'   id='password' name='password'/>

					<button type='sumbit' className='mt-3 btn btn-info'>
						{/* {isLoading?  */}
							{/* <><i className='fas fa-spinner fa-spin'></i></> */}
						{/* : */}
							Register
						{/* } */}

					</button>
				</form>
			</div>
		</div>

	</>
}