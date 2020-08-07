import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "./Authentication/AuthService";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

const required = value => {
    if (!value) {
        return (
            <div role="alert" style={{color: "red"}}>
                Doldurulması zorunlu alan
            </div>
        );
    }
};

function LoginButton(props) {
    return <Card elevation={3}
                 style={{display: "inline-block", marginTop: "20px", borderRadius: "5px"}}><Button
        onClick={() => {
            props.onClick()
        }}
        style={{
            width: "120px",
            backgroundColor: "azure",
            textTransform: "none",
            padding: "5px 0px",
            fontSize: "15px",
            fontWeight: "bold",
            elevation: "15"
        }}
    >{props.label}</Button>
    </Card>;
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    componentDidMount() {
        if (AuthService.getCurrentUser()) {
            AuthService.validate()
                .catch(reason => {
                    AuthService.logout()
                    window.location.reload(false)
                })
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, this.state.password).then(
                (response) => {
                    if (response.roles[0] === "ROLE_ADMIN") {

                        this.props.history.push("/kurum");
                    } else if (response.roles[0] === "ROLE_USER") {
                        this.props.history.push("/katilimci")
                    }
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <div className="login">
                <Card
                    className="card card-container"
                    elevation={20}
                >
                    <img
                        src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    {AuthService.getCurrentUser() ? this.userInformation() : this.getForm()}

                </Card>
            </div>
        );
    }

    getForm() {
        return <div>
            <Form
                onSubmit={this.handleLogin}
                ref={c => {
                    this.form = c;
                }}
            >
                <div className="form-group">
                    <Input
                        type="text"
                        className="form-control"
                        name="username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        validations={[required]}
                        style={{
                            width: "200px",
                            fontSize: "18px",
                            borderRadius: "5px",
                            textAlign: "center",
                            marginTop: "20px",
                            padding: "5px 0px"
                        }}
                        placeholder={"Kullanıcı Adı"}
                    />
                </div>

                <div className="form-group">
                    <Input
                        type="password"
                        className="form-control"
                        name="password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        validations={[required]}
                        style={{
                            width: "200px",
                            fontSize: "18px",
                            borderRadius: "5px",
                            marginTop: "20px",
                            textAlign: "center",
                            padding: "5px 0px"
                        }}
                        placeholder={"Şifre"}
                    />
                </div>

                <div className="form-group">
                    <button
                        disabled={this.state.loading}
                        style={{
                            fontFamily: "Helvetica",
                            width: "120px",
                            marginTop: "20px",
                            fontSize: "15px",
                            padding: "5px 0px",
                            borderRadius: "5px",
                            backgroundColor: "azure",
                            fontWeight: "bolder",
                            borderColor: "azure",
                            cursor: "pointer",
                            lineHeight: "1.75",
                            border: "0px",
                            boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)"
                        }}
                    >
                        {this.state.loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span className="MuiButton-label">Giriş Yap</span>
                    </button>
                </div>

                {this.state.message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {this.state.message}
                        </div>
                    </div>
                )}
                <CheckButton
                    style={{display: "none"}}
                    ref={c => {
                        this.checkBtn = c;
                    }}
                />
            </Form>
            <LoginButton
                onClick={() => {
                    AuthService.logout()
                    this.props.history.push("/katilimci")
                }}
                label="Misafir Girişi"
            />
        </div>;
    }

    userInformation() {
        return <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                color: "white",
                fontSize: "30px",
                fontWeight: "bold"
            }}>
            {AuthService.getCurrentUser().username}
            <LoginButton
                onClick={() => {
                    this.props.history.push(AuthService.getCurrentUser().roles[0] === "ROLE_ADMIN" ? "/kurum" : "/katilimci")
                }}
                label="Anasayfa"
            />
            {AuthService.getCurrentUser().roles[0] === "ROLE_ADMIN" && <LoginButton
                onClick={() => {
                    this.props.history.push("/katilimci")
                }}
                label="Başvuru Ekranı"
            />}
            <LoginButton
                onClick={() => {
                    AuthService.logout()
                    window.location.reload(false)
                }}
                label="Çıkış Yap"
            />
        </div>
    }
}
