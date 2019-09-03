import fetch from './fetch_utils';
import web from './web_utils';
import data from './data_utils';
import auth from "./auth_utils";

const AllMembersRoute = "/api/users";
const DeptMembersRoute = "/api/users/myDepartment";
const GroupMembersRoute = "/api/users/myGroup";
const LibraryMembersRoute = "/api/bbt/library";
const QueryMembersRoute = "/api/users/search";
const QueryRecycleRoute = "/api/users/recycle";

var admin = {

    cur_page_data: {},
    cur_page_data_in_show: [],

    getMembers: async (data, route) => {
        let res_data = await auth.send("GET", route, data);
        let res = res_data && !res_data.error;
        admin.cur_page_data = res ? res_data : {};
        admin.cur_page_data_in_show = [];
        return res;
    },

    getShowData: () => {
        if(admin.cur_page_data_in_show.length <= 0)
            for(var key in admin.cur_page_data.data) {
                let data = admin.cur_page_data.data[key];
                admin.cur_page_data_in_show.push(
                    admin.convertToShowData(data));
            }
        return admin.cur_page_data_in_show;
    },

    convertToShowData: (data) => ({
        id: data.id, sno: data.sno,
        name: data.detail.name, sex: data.detail.sex,
        dept: data.department.name, group: data.group.name,
        create: data.created_at ? data.created_at.substring(0,10) : ''
    }),

    getAllMembers: async (page) => await admin.getMembers({page}, AllMembersRoute),
    getDeptMembers: async (page) => await admin.getMembers({page}, DeptMembersRoute),
    getGroupMembers: async (page) => await admin.getMembers({page}, GroupMembersRoute),

    getLibraryMembers: async (year, department_id, page) =>
        await admin.getMembers({year, department_id, page}, LibraryMembersRoute),

    getRecycleMembers: async (page) => await admin.getMembers({page}, QueryRecycleRoute),

    searchMembers: async (query, page) => await admin.getMembers(
        {query, page}, QueryMembersRoute),
};

export default admin;
