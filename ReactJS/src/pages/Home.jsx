import {CrownOutlined} from "@ant-design/icons";
import {Result} from "antd";

const Home = () => {
    return (
        <div style={{padding: 20}}>
            <Result
                icon={<CrownOutlined />}
                title="Welcome to JSON Web Token (JWT) Generator"
            />
        </div>
    );
}
export default Home;