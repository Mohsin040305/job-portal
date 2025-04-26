import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    const navigate = useNavigate();
  //  const jobId = 'jodawEQTWVTCEAWTEQWAT';
  const daysAgoFuntion = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference/(1000*24*60*60));
  }
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-500'>{daysAgoFuntion(job?.createdAt) === 0 ? "Today" : `${daysAgoFuntion(job?.createdAt)} days ago`}</p>
            <Button variant="outline" className="rounded-full border-none cursor-pointer" size="icon"><Bookmark /></Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button>
                    <Avatar>
                        <AvatarImage src={job?.company?.logo}/>
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.comapany?.name}</h1>
                    <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge variant="ghost" className={'text-blue-700 font-bold'}>{job?.position}</Badge>
                <Badge variant="ghost" className={'text-[#F83002] font-bold'}>{job?.jobType}</Badge>
                <Badge variant="ghost" className={'text-[#7209b7] font-bold'}>{job?.salary} LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)}variant="outline" className="cursor-pointer">Details</Button>
                <Button className="bg-black text-white cursor-pointer">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job