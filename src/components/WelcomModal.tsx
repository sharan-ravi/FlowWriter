import React, { useEffect, useRef } from 'react'
import PeerlistLogo from '../assets/peerlist-logo.png'
import ProgressBar from '@ramonak/react-progress-bar'

export default function WelcomeModal({
    progress
}: {
    progress: number
}) {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
            }
        };

        const dialogElement = modalRef.current;
        dialogElement?.addEventListener('keydown', handleEsc);

        return () => {
            dialogElement?.removeEventListener('keydown', handleEsc);
        };
    }, []);

    return (
        <dialog id="my_modal_1" className="modal" ref={modalRef}>
            <div className="modal-box">
                <div className="flex flex-col space-y-6">

                    <h3 className="font-bold text-lg">Welcome to FlowWriter!</h3>

                    <p className="text-lg text-gray-300 leading-loose">
                    <span className="font-bold bg-purple-800 px-2 py-1 rounded">FlowWriter</span> 📝 is a minimal writing tool that is powered by <span className="italic bg-blue-800 px-2 py-1 rounded">an on-device AI</span> to help you stay in <span className="font-bold bg-green-800 px-2 py-1 rounded">flow</span> while writing. This tool features an <span className="font-bold bg-red-800 px-2 py-1 rounded">on-device AI model</span>, guaranteeing that your data <span className="font-bold bg-blue-800 px-2 py-1 rounded">never leaves your machine</span>. 🛡️ Built for the <span className="font-bold bg-gray-800 px-2 py-1 rounded">Peerlist Hackathon.</span>

                    </p>

                    <div className="flex flex-col space-y-2">
                        <p>
                            <strong>The AI model is currently downloading.</strong> This is a one-time process that may take a few minutes. <strong>Future runs will load the model directly from your browser cache</strong>, speeding up the process.
                        </p>

                        <ProgressBar completed={Math.round(progress * 100)} />
                    </div>


                    <p>
                        Made by Sharan, with ❤️ for <img src={PeerlistLogo} className="bg-white p-1 h-10 ml-1 inline" alt="Peerlist Logo" />
                    </p>

                </div>

                {progress === 1 && <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-success text-white">Start writing!</button>
                    </form>
                </div>}
            </div>
        </dialog>
    )
}
