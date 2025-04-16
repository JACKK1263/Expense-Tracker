import React from 'react'
import "./styles.css";
import { Card, Row } from "antd";
import Button from '../Button';

function Cards({income,expenses,currentBalance, showExpenseModal, showIncomeModal }) {
    return (
        <div>
            <Row className="my-row">
                <Card bordered={true} className="my-card">
                    <h2>Current Balance</h2>
                    <p>{currentBalance}</p>
                <Button text="Reset Button"  style={{display:"none"}} blue={true}></Button>
                </Card>
                <Card bordered={true} className="my-card" >
                    <h2>Total Income</h2>
                    <p>{income}</p>
                    <Button text="Reset Button" blue={true} onClick={showIncomeModal}></Button>
                </Card>
                <Card bordered={true} className="my-card" >
                    <h2>Total Expense</h2>
                    <p>{expenses}</p>
                    <Button text="Reset Button" blue={true} onClick={showExpenseModal}></Button>
                </Card>
            </Row>
        </div>
    )
}
export default Cards
