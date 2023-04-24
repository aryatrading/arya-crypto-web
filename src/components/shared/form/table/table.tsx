import { FC, TableHTMLAttributes, useMemo } from "react";
import styles from "./table.module.scss";


type tableHeader = {
    label: string,
    width: number
}

interface tableType extends TableHTMLAttributes<HTMLTableElement> {
    headers: tableHeader[],
    
}

const Table: FC<{}> = () => {

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Weight</th>
                    <th>Amount</th>
                    <th>Current Price</th>
                    <th>Value</th>
                    <th>24h P/L</th>
                    <th>Exchange</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Bitcoin</td>
                    <td>75%</td>
                    <td>0.410201 BTC</td>
                    <td>$28,183.46</td>
                    <td>$1073.88</td>
                    <td>+5% (+$152.8)</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
}

export default Table;