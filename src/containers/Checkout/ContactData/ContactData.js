import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-order';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component{
    state ={
        orderform: {
            name: {
                elemType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: 'true'
                },
                valid: false,
                touched: false
            },
            street: {
                elemType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: '',
                validation: {
                    required: 'true'
                },
                valid: false,
                touched: false
            },
            country: {
                elemType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Country'
                },
                value: '',
                validation: {
                    required: 'true'
                },
                valid: false,
                touched: false
            },
            email: {
                elemType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: 'true'
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elemType: 'select',
                elementConfig: {
                    options: [{value: 'fastest', displayValue:'Fastest'},
                                {value: 'cheapest', displayValue:'Cheapest'}
                                ]
                },
                validation: {},
                valid: true,
                value: 'fastest'
            },
        },
        formIsValid: false,
        loading: false
    }

    checkValidation(value, rules) {
        let isValid= true;

        if (rules && rules.required)
        {
            isValid = value.trim() !== '';
        }
        if (rules && rules.minLength){
            isValid = value.length >= rules.minLength
        }
        return(isValid);
    }
    orderHandler =(event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData={};
        for (let formelem in this.state.orderform){
            formData[formelem] = this.state.orderform[formelem].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData   
        };
        
        axios.post('/orders.json', order)
            .then (response =>{
                this.setState({loading: false})
            })
            .catch (error => {
                this.setState({loading: false})
            })
        this.props.history.push('/');
    }

    inputChangedHandler = (event, inputId) => {
        const updatedform = {
            ...this.state.orderform
        };
        const updatedelem = {
            ...updatedform[inputId]
        };
        updatedelem.value = event.target.value;
        updatedelem.valid = this.checkValidation(updatedelem.value,updatedelem.validation);
        updatedelem.touched = true;
        updatedform[inputId] = updatedelem;
        let formIsValid = true;
        for (let inputId in updatedform){
            formIsValid = updatedform[inputId].valid && formIsValid;
        }
        console.log(formIsValid);
        this.setState({orderform: updatedform, formIsValid: formIsValid});
    }

    render(){
        let formElementsArray = [];
        for (let key in this.state.orderform){
            formElementsArray.push({
                id: key,
                config: this.state.orderform[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}> 
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        touched={formElement.config.touched}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        elementType={formElement.config.elemType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) =>this.inputChangedHandler(event, formElement.id)}
                        />
                        )
                )}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>);
        if (this.state.loading)
            form =<Spinner/>
        return(
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                    {form}
            </div>
        );
    }
}
export default ContactData;