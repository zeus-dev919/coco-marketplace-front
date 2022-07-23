import React, { useState } from "react";
import Footer from "../menu/footer";
import SignIn from "../components/signin";
import SignUp from "../components/signup";

const Sign = () => {
    const [authPage, setAutoPage] = useState(true);

    return (
        <div>
            <section className="container sign">
                {authPage ? (
                    <SignIn auth={setAutoPage} />
                ) : (
                    <SignUp auth={setAutoPage} />
                )}
            </section>
            <Footer />
        </div>
    );
};

export default Sign;
