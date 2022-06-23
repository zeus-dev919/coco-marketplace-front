const M_ItemdetailRedex = (props) => {
    const { type, part, per } = props;

    return (
        <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="nft_attr">
                <h3 className="color">{type}</h3>
                <h4>{per}</h4>
            </div>
        </div>
    );
};

export default M_ItemdetailRedex;
