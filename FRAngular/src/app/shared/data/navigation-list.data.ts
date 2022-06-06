import { NavItem } from "../models/nav-item.model";

export class NavigationList {
  static get items(): NavItem[] {
    return [

          {
            displayName: "Application",
            iconName: "computer",
            route: "application",
          },

          {
            displayName: "Category List",
            iconName: "list",
            route: "categoryList",
          },
          {
            displayName: "Service Setup",
            iconName: "phonelink_setup",
            route: "service-setup",
          },

          {
            displayName: "User Profile",
            iconName: "account_circle",
            route: "user",
          },

          {
            displayName: "Report Parameter",
            iconName: "list_alt",
            route: "report-parameter",
          },
          {
            displayName: "Authorization",
            iconName: "security",
            route: "authorization",
          },
          {
            displayName: "Active Session",
            iconName: "supervisor_account",
            route: "active-session",
          },
          {
            displayName: "Common Code",
            iconName: "local_offer",
            route: "common-code",
          },
          {
            displayName: "Role",
            iconName: "date_range",
            route: "role",
          },
          {
            displayName: "Menu",
            iconName: "menu",
            route: "menu",
          },
          {
            displayName: "Feature",
            iconName: "dns",
            route: "feature",
          },
          {
            displayName: "Assign Role",
            iconName: "assignment_ind",
            route: "assign-role",
          },
          {
            displayName: "Role Wise Assigned Feature ",
            iconName: "group_add",
            route: "role-wise-assigned-feature",
          },
          {
            displayName: "Dashboard",
            iconName: "dashboard",
            route: "dashboard",
          },



      {
        displayName: "Password Policy",
        iconName: "receipt",
        route: "passwordPolicy",

      },
      {
        displayName: "User Session Log ",
        iconName: "date_range",
        route: "user-session-log",

      },
    ];
  }
}



















































// import { NavItem } from "../models/nav-item.model";

// export class NavigationList {
//   static get items(): NavItem[] {
//     return [
//       {
//         displayName: "Application Setup",
//         iconName: "settings_suggest",
//         route: "",
//         children: [
//           {
//             displayName: "Application",
//             iconName: "date_range",
//             route: "application",
//           },

//           {
//             displayName: "Category List",
//             iconName: "date_range",
//             route: "categoryList",
//           },
//           {
//             displayName: "Service Setup",
//             iconName: "date_range",
//             route: "service-setup",
//           },

//           {
//             displayName: "User",
//             iconName: "date_range",
//             route: "user",
//           },

//           {
//             displayName: "Report Parameter",
//             iconName: "date_range",
//             route: "report-parameter",
//           },
//           {
//             displayName: "Authorization",
//             iconName: "date_range",
//             route: "authorization",
//           },
//           {
//             displayName: "Active Session",
//             iconName: "date_range",
//             route: "active-session",
//           },
//           {
//             displayName: "Common Code",
//             iconName: "date_range",
//             route: "common-code",
//           },
//           {
//             displayName: "Role",
//             iconName: "date_range",
//             route: "role",
//           },
//           {
//             displayName: "Menu",
//             iconName: "date_range",
//             route: "menu",
//           },
//           {
//             displayName: "Feature",
//             iconName: "date_range",
//             route: "feature",
//           },
//           {
//             displayName: "Assign Role",
//             iconName: "date_range",
//             route: "assign-role",
//           },
//           {
//             displayName: "Role Wise Assigned Feature ",
//             iconName: "date_range",
//             route: "role-wise-assigned-feature",
//           },
//           {
//             displayName: "Dashboard",
//             iconName: "date_range",
//             route: "dashboard",
//           },


//         ],
//       },
//       {
//         displayName: "Configuration",
//         iconName: "build",
//         route: "",
//         children: [
//           {
//             displayName: "Password Policy",
//             iconName: "date_range",
//             route: "passwordPolicy",
//           },
//         ],
//       },
//     ];
//   }
// }
