import Home from "../pages/Home/Home";
import Tournaments from "../pages/Tournaments/Tournaments";
import Tournament from "../pages/Tournament/Tournament";
import CreateTournament from "../pages/CreateTournament/CreateTournament";
import CreateBracket from "../pages/CreateBracket/CreateBracket";
import Bracket from "../pages/Bracket/Bracket";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import EditTournament from "../pages/EditTournament/EditTournament";
import PasswordReset from "../pages/PasswordReset/PasswordReset";
import PasswordResetConfirm from "../pages/PasswordResetConfirm/PasswordResetConfirm";
import Login from "../pages/Login/Login";
import FeedBack from "../pages/Feedback/FeedBack";


export const privateRoutes = [
    { path: '/create_tournament', element: <CreateTournament />, exact: true },
    { path: '/edit_tournament/:slug', element: <EditTournament />, exact: true },
    { path: '/', element: <Home />, exact: true },
    { path: '/tournaments', element: <Tournaments />, exact: true },
    { path: '/tournament/:slug', element: <Tournament />, exact: true },
    { path: '/bracket/:id', element: <Bracket />, exact: true },
    { path: '/create_bracket', element: <CreateBracket />, exact: true },
    { path: '/profile/:slug', element: <Profile />, exact: true },
    { path: '/register', element: <Register />, exact: true },
    { path: '/feedback', element: <FeedBack />, exact: true}
]

export const publicRoutes = [
    { path: '/', element: <Home />, exact: true },
    { path: '/tournaments', element: <Tournaments />, exact: true },
    { path: '/tournament/:slug', element: <Tournament />, exact: true },
    { path: '/bracket/:id', element: <Bracket />, exact: true },
    { path: '/create_bracket', element: <CreateBracket />, exact: true },
    { path: '/profile/:slug', element: <Profile />, exact: true },
    { path: '/login', element: <Login />, exact: true },
    { path: '/register', element: <Register />, exact: true },
    { path: '/password_reset', element: <PasswordReset />, exact: true },
    { path: '/password_reset_confirm/:uid/:token', element: <PasswordResetConfirm />, exact: true },
]