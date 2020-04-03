import React, {Component} from 'react'
import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component{
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({error: true})
            })
    }
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    updatePurchaseState(ingredients){
        const cpingredients = {
            ...ingredients
        };
        const sum = Object.keys(cpingredients)
            .map(igKey => {
                return cpingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            },0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const updatedCount = this.state.ingredients[type] + 1;
        const updatedIngedients = {
            ...this.state.ingredients
        };
        updatedIngedients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const newPrice = this.state.totalPrice + priceAddition;
        this.setState({ingredients: updatedIngedients, totalPrice: newPrice});
        this.updatePurchaseState(updatedIngedients);
    }

    removeIngredientHandler = (type) =>{
        const updatedCount = this.state.ingredients[type] - 1;
        const updatedIngedients = {
            ...this.state.ingredients
        };
        updatedIngedients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const newPrice = this.state.totalPrice - priceAddition;
        this.setState({ingredients: updatedIngedients, totalPrice: newPrice});
        this.updatePurchaseState(updatedIngedients);
    }
    purchaseCancelHandler= () => {
        this.setState({purchasing: false});
    };
    purchaseContinueHandler= () =>{
        //alert('We continue');
        
        const queryParams= [];

        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search: '?' + queryString
        });
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
        
        let burger = this.state.error ? <p style= {{textAlign: 'center'}}>Ingredients can't be Loaded!</p> : <Spinner/>; 
        
        if (this.state.ingredients)
        {
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        purchased={this.purchaseHandler}
                        addIg={this.addIngredientHandler}
                        removeIg={this.removeIngredientHandler}
                        disabledInfo={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        />
                </Auxiliary>
            )
            orderSummary = <OrderSummary
                                totalPrice={this.state.totalPrice}
                                purchaseCanceled={this.purchaseCancelHandler}
                                purchaseContinued={this.purchaseContinueHandler}
                                ingredients={this.state.ingredients}/>
        }
        if (this.state.loading)
            orderSummary= <Spinner />
        return(
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);