import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/Login";
import UserInfo from "@/components/UserInfo";
import EditInfo from "@/components/EditInfo";
import RestPassword from "@/components/ResetPassword";
import MembersInfo from "@/components/MembersInfo";
import BBTLibrary from "@/components/BBTLibrary";
import MemberSearch from "@/components/MemberSearch";
import CreateMembers from "@/components/CreateMembers";
import RecycleMembers from "@/components/RecycleMembers";
import StallsInfo from "@/components/StallsInfo";
import CreateStall from "@/components/CreateStall";
import ScheduleForm from "@/components/ScheduleForm";
import ScheduleVerify from "@/components/ScheduleVerify";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "Login",
            component: Login
        },
        {
            path: "/schedule",
            name: "ScheduleForm",
            component: ScheduleForm
        },
        {
            path: "/schedule_verify",
            name: "ScheduleVerify",
            component: ScheduleVerify
        },
        {
            path: "/user",
            name: "UserInfo",
            component: UserInfo
        },
        {
            path: "/edit",
            name: "EditInfo",
            component: EditInfo
        },
        {
            path: "/reset",
            name: "RestPassword",
            component: RestPassword
        },
        {
            path: "/members",
            name: "MembersInfo",
            component: MembersInfo
        },
        {
            path: "/library",
            name: "BBTLibrary",
            component: BBTLibrary
        },
        {
            path: "/search",
            name: "MemberSearch",
            component: MemberSearch
        },
        {
            path: "/create",
            name: "CreateMembers",
            component: CreateMembers
        },
        {
            path: "/recycle",
            name: "RecycleMembers",
            component: RecycleMembers
        },

        {
            path: "/stalls",
            name: "StallsInfo",
            component: StallsInfo
        },
        {
            path: "/create_stall",
            name: "CreateStall",
            component: CreateStall
        },
        {
            path: "/logout",
            name: "Logout",
            component: UserInfo
        }
    ]
});
