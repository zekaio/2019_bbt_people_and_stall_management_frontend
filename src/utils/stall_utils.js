import auth from "./auth_utils";

const GetStallRoute = "/api/stall/show";
const UpdateStallRoute = "/api/stall/update";
const DeleteStallRoute = "/api/stall/delete";
const CreateStallRoute = "/api/stall/new";

const GetAllSubStallRoute = "/api/stall/task/showlist";
const GetSubStallRoute = "/api/stall/task/show";
const GetSubStallMemberRoute = "/api/stall/task/member";
const AddDutySubStallRoute = "/api/stall/task/add";
const DeleteDutySubStallRoute = "/api/stall/task/deleteadmin";
const DeleteSubStallRoute = "/api/stall/task/delete";
const CreateSubStallRoute = "/api/stall/task/new";

const ExportSubStallRoute = "/api/stall/export";

const RandomSubStallRoute = "/api/stall/task/create";

const CheckInSubStallRoute = "/api/stall/task/check";

const CreateFirstWeekRoute = "/api/stall/calendar/new";

var stall = {
    stalls: [],

    // 操作摆摊
    oper: async (oper, route, id, params) => {
        route += id === undefined ? "" : "/" + id;
        return await auth.send(oper, route, params);
    },

    refreshStalls: async () => {
        stall.stalls = (await stall.oper("GET", GetStallRoute)) || [];
        console.info("refreshStalls: ", stall.stalls);
        return stall.stalls;
    },

    getStalls: async () => {
        if (stall.stalls.length <= 0) await stall.refreshStalls();
        return stall.stalls;
    },

    getStall: async id => await stall.oper("GET", GetStallRoute, id),

    updateStall: async (id, name, description, department_id) =>
        !(await stall.oper("PUT", UpdateStallRoute, id, {
            name,
            description,
            department_id
        })),

    deleteStall: async id =>
        !(await stall.oper("DELETE", DeleteStallRoute, id)),

    createStall: async (name, description, department_id) =>
        await stall.oper("POST", CreateStallRoute, undefined, {
            name,
            description,
            department_id
        }),

    getSubStalls: async id => await stall.oper("GET", GetAllSubStallRoute, id),

    getSubStall: async id => await stall.oper("GET", GetSubStallRoute, id),

    getSubStallMember: async id =>
        await stall.oper("GET", GetSubStallMemberRoute, id),

    addSubStallDuty: async (id, sno) =>
        await stall.oper("POST", AddDutySubStallRoute, id, { sno }),

    deleteSubStallDuty: async id =>
        await stall.oper("DELETE", DeleteDutySubStallRoute, id),

    deleteSubStall: async id =>
        await stall.oper("DELETE", DeleteSubStallRoute, id),

    createSubStall: async (
        stall_id,
        campus,
        location,
        date,
        number,
        start,
        end
    ) =>
        await stall.oper("POST", CreateSubStallRoute, undefined, {
            stall_id,
            campus,
            location,
            date,
            number,
            start,
            end
        }),

    randomSubStall: async task_id =>
        await stall.oper("POST", RandomSubStallRoute, undefined, { task_id }),

    checkInSubStall: async (id, user_id) =>
        await stall.oper("PUT", CheckInSubStallRoute, id, { user_id }),

    getExportPath: async id => await stall.oper("GET", ExportSubStallRoute, id),

    createFirstWeekRoute: async (year, term, date) =>
        await stall.oper("POST", CreateFirstWeekRoute, undefined, {
            year,
            term,
            date
        })
};

export default stall;
