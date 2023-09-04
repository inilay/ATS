import Login from "../pages/Login";
import Home from "../pages/Home";
import Tournaments from "../pages/Tournaments";
import Tournament from "../pages/Tournament";
import CreateTournament from "../pages/CreateTournament";
import CreateBracket from "../pages/CreateBracket";
import Bracket from "../pages/Bracket";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import EditTournament from "../pages/EditTournament";
import PasswordReset from "../pages/PasswordReset";
import PasswordResetConfirm from "../pages/PasswordResetConfirm";


export const privateRoutes = [
    {path: '/create_tournament', element: <CreateTournament/>, exact: true},
    {path: '/edit_tournament/:slug', element: <EditTournament/>, exact: true},
    {path: '/', element: <Home/>, exact: true},
    {path: '/tournaments', element: <Tournaments/>, exact: true},
    {path: '/tournament/:slug', element: <Tournament/>, exact: true},
    {path: '/bracket/:id', element: <Bracket/>, exact: true},
    {path: '/create_bracket', element: <CreateBracket/>, exact: true},
    {path: '/profile/:slug', element: <Profile/>, exact: true},
]

export const publicRoutes = [
    {path: '/', element: <Home/>, exact: true},
    {path: '/tournaments', element: <Tournaments/>, exact: true},
    {path: '/tournament/:slug', element: <Tournament/>, exact: true},
    {path: '/bracket/:id', element: <Bracket/>, exact: true},
    {path: '/create_bracket', element: <CreateBracket/>, exact: true},
    {path: '/profile/:slug', element: <Profile/>, exact: true},
    {path: '/login', element: <Login/>, exact: true},
    {path: '/register', element: <Register/>, exact: true}, 
    {path: '/password_reset', element: <PasswordReset/>, exact: true},
    {path: '/password_reset_confirm/:uid/:token', element: <PasswordResetConfirm/>, exact: true},
]