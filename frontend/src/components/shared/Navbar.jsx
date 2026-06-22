import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { User2, LogOut, Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                navigate("/")
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">

                {/* Logo */}
                <h1 className="text-2xl font-bold">GetHired!</h1>

                {/* Desktop Menu */}
                <ul className="hidden md:flex font-medium items-center gap-6">
                    {user?.role === 'recruiter' ? (
                        <>
                            <li><Link to="/admin/companies">Companies</Link></li>
                            <li><Link to="/admin/jobs">Jobs</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/jobs">Jobs</Link></li>
                            <li><Link to="/browse">Browse</Link></li>
                        </>
                    )}
                </ul>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-2">
                    {!user ? (
                        <>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button variant="outline">Signup</Button></Link>
                        </>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profile?.profilePhoto} />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-72">
                                <div className="flex gap-3">
                                    <Avatar>
                                        <AvatarImage src={user?.profile?.profilePhoto} />
                                    </Avatar>
                                    <div>
                                        <h4 className="font-medium">{user?.fullname}</h4>
                                        <p className="text-sm text-muted-foreground">{user?.bio}</p>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-2">
                                    {user.role === "student" && (
                                        <Link to="/profile" className="flex items-center gap-2">
                                            <User2 size={18} /> View Profile
                                        </Link>
                                    )}
                                    <button
                                        onClick={logoutHandler}
                                        className="flex items-center gap-2 text-red-500"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white px-4 pb-4 w-full space-y-3 flex flex-col z-50 shadow-lg sticky top-0 ">
                    {user?.role === 'recruiter' ? (
                        <>
                            <Link to="/admin/companies" onClick={() => setOpen(false)}>Companies</Link>
                            <Link to="/admin/jobs" onClick={() => setOpen(false)}>Jobs</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                            <Link to="/jobs" onClick={() => setOpen(false)}>Jobs</Link>
                            <Link to="/browse" onClick={() => setOpen(false)}>Browse</Link>
                        </>
                    )}

                    {!user ? (
                        <div className="flex gap-2">
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button variant="outline">Signup</Button></Link>
                        </div>
                    ) : (
                        <>
                            {user.role === "student" && (
                                <Link to="/profile">View Profile</Link>
                            )}
                            <button onClick={logoutHandler} className="text-red-500">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Navbar
