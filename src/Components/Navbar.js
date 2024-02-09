import toast from "react-hot-toast";
import { Link } from "react-router-dom";
export default function Navbar(props) {
    let isLoggedIn = props.isLoggedIn
    let setIsLoggedIn = props.setIsLoggedIn
  return (
    <div className="flex justify-between items-center w-11/12 max-w-full py-4 mx-auto ">
      <Link to="/"></Link>

      <nav className="text-richblack-100 flex items-center justify-between  p-4">
    <Link to="/" className="text-2xl font-bold text-black">Agile Task</Link>
        </nav>



        {/* Login - SignUp - LogOut - Dashboard */}
        <div className='flex items-center gap-x-4'>
            { !isLoggedIn &&
                <Link to="/login">
                    <button className='bg-richblack-800 text-richblack-100 py-[8px] 
                    px-[12px] rounded-[8px] border border-richblack-700'>
                        Log in
                    </button>
                </Link>
            }
            { !isLoggedIn &&
                <Link to="/signup">
                    <button  className='bg-richblack-800 text-richblack-100 py-[8px] 
                    px-[12px] rounded-[8px] border border-richblack-700'>
                        Sign up
                    </button>
                </Link>
            }
            { isLoggedIn &&
                <Link to="/">
                    <button onClick={()=>{
                        setIsLoggedIn(false)
                        toast.success('Logout successfully')
                    }}
                    className='bg-richblack-800 text-richblack-100 py-[8px] 
                    px-[12px] rounded-[8px] border border-richblack-700'>
                        Log Out
                    </button>
                </Link>
            }
            { isLoggedIn &&
                <Link to="/dashboard">
                <button
                 className='bg-richblack-800 text-richblack-100 py-[8px] 
                px-[12px] rounded-[8px] border border-richblack-700'>
                    Dashboard
                </button>
            </Link>
        }
    </div>
  
</div>
)
}
  
