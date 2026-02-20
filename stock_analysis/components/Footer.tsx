import React from 'react'
import Divider from './Divider'

function Footer() {
    return (
        <>
            <footer className="w-full mt-24  bg-black">
                <div className="max-w-6xl mx-auto px-6 py-10 text-neutral-300">

                    <h2 className="text-emerald-400 text-lg font-semibold mb-6">
                        Project Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

                        <div>
                            <p className="text-neutral-500">Project Title</p>
                            <p className="font-medium">Stock Market Technical Indicator Visualizer</p>
                        </div>


                        <div>
                            <p className="text-neutral-500">Subject</p>
                            <p className="font-medium">Hardware and Software workshop</p>
                        </div>

                         <div>
                            <p className="text-neutral-500">Project Description</p>
                            <p className="font-medium">Capstone Project Unit 2 : Data visualization and analytics with R-programming </p>
                        </div>

                        <div>
                            <p className="text-neutral-500">Group No</p>
                            <p className="font-medium">Group 06</p>
                        </div>

                        <div>
                            <p className="text-neutral-500">Member 1</p>
                            <p className="font-medium">Vivek Patel (2023UCS1645)</p>
                        </div>

                        <div>
                            <p className="text-neutral-500">Member 2</p>
                            <p className="font-medium">Piyush Shukla (2023UCS1659)</p>
                        </div>

                    </div>

                    {/* Bottom Line */}
                    <div className="mt-8 text-xs text-neutral-500 border-t border-neutral-800 pt-4">
                        © {new Date().getFullYear()} Academic Project — Built using Next.js, Express & R
                    </div>

                </div>
            </footer>
        </>

    )
}

export default Footer