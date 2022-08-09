export default function TokenCard(props) {
    const { balance, label } = props;
    return (
        <div className="form-control tokencard">
            <span>
                {balance} {label}
            </span>

            <span>{">"}</span>
        </div>
    );
}
