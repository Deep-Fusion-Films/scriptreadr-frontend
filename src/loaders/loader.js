import { redirect } from "react-router-dom";
import { checkAuthToken } from "../util";

export async function protectedRouteLoader() {
    const token = await checkAuthToken();

    if(!token) {
        return redirect("/signin");
    }
    return null;
}