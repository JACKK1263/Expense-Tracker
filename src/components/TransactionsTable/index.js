import React, { useState } from 'react'
import "./styles.css";
import { Radio, Select, Table } from 'antd';
import searchImg from "../../assets/search.svg"
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';
import moment from "moment";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

function TransactionsTable({ transactions, fetchTransactions, addTransaction }) {
    const { Option } = Select;
    const [search, setSearch] = useState();
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Date & Time",
            dataIndex: "date",
            key: "date",
            render: (text) => text ? moment(text).format("YYYY-MM-DD") : "N/A",
        },
        ,
        {
            title: "Amount (₹)",
            dataIndex: "amount",
            key: "amount",
            render: (text, record) => (
              <span style={{ color: record.type === "income" ? "green" : "red", display: "flex", alignItems: "center", gap: 6 }}>
                {record.type === "income" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                ₹ {text}
              </span>
            ),
          },          
        {
            title: "Tag",
            dataIndex: "tag",
            key: "tag",
        },
    ];

    let filteredTransactions = transactions.filter((item) => {
        const matchesName = (item.name?.toLowerCase() || "").includes(search?.toLowerCase() || "");
        const matchesType = typeFilter ? item.type === typeFilter : true;
        const matchesMonth = selectedMonth
          ? moment(item.date).month() + 1 === Number(selectedMonth)
          : true;
      
        return matchesName && matchesType && matchesMonth;
      });
      


    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });

    function exportCsv() {
        const csv = unparse(transactions, {
            fields: ["name", "type", "date", "amount", "tag"],
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function importFromCsv(event) {
        event.preventDefault();
        try {
            parse(event.target.files[0], {
                header: true,
                complete: async function (results) {
                    console.log("RESULTS", results);
                    for (const transaction of results.data) {
                        console.log("Transactions", transaction);
                        const newTransaction = {
                            ...transaction,
                            amount: parseInt(transaction.amount),
                            date: moment(transaction.date).isValid()
                              ? moment(transaction.date).format("YYYY-MM-DD")
                              : moment().format("YYYY-MM-DD"), 
                          };                     
                        await addTransaction(newTransaction, true);
                    }
                },
            });
            toast.success("All Transactions Added");
            fetchTransactions();
            event.target.files = null;
        } catch (e) {
            toast.error(e.message);
        }
    }

    return <div
        style={{
            width: "96%",
            padding: "0rem 1rem",
        }}
    >
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                alignItems: "center",
                marginBottom: "1rem",
            }}
        >
            <div className="input-flex">
                <img src={searchImg} width="16" alt="Search icon" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name"
                />
            </div>
            <Select
                className="select-input"
                onChange={(value) => setTypeFilter(value)}
                value={typeFilter}
                placeholder="Filter"
                allowClear>
                <Option value="">All</Option>
                <Option value="income">Income</Option>
                <Option value="expense">Expense</Option>
            </Select>
            <Select
                className="select-input"
                onChange={(value) => setSelectedMonth(value)}
                value={selectedMonth}
                placeholder="Filter by Month"
                allowClear
            >
                <Option value="">All Months</Option>
                {Array.from({ length: 12 }, (_, i) => (
                    <Option key={i} value={i + 1}>
                        {moment().month(i).format("MMMM")}
                    </Option>
                ))}
            </Select>
        </div>
        <div className="my-table">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "1rem",
                }}
            >
                <h2>My Transactions</h2>

                <Radio.Group
                    className="input-radio"
                    onChange={(e) => setSortKey(e.target.value)}
                    value={sortKey}
                >
                    <Radio.Button value="">No Sort</Radio.Button>
                    <Radio.Button value="date">Sort by Date</Radio.Button>
                    <Radio.Button value="amount">Sort by Amount</Radio.Button>
                </Radio.Group>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem",
                        width: "400px",
                    }}
                >
                    <button className="btn" style={{ fontSize: "0.8rem" }} onClick={exportCsv}>
                        Export to CSV
                    </button>
                    <label for="file-csv" className="btn btn-blue" style={{ fontSize: "0.8rem" }} >
                        Import from CSV
                    </label>
                    <input
                        id="file-csv"
                        type="file"
                        accept=".csv"
                        required
                        style={{ display: "none" }}
                        onChange={importFromCsv}
                    />
                </div>
            </div>
            <Table dataSource={sortedTransactions} columns={columns} />
        </div>
    </div>
}

export default TransactionsTable