const ProfilePage = ({ isDarkMode, onLogout }) => (
    <div className={`py-20 max-w-3xl mx-auto p-6 rounded-3xl shadow-xl my-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-pink-500 flex items-center justify-center text-4xl font-bold text-white mb-4">
                J
            </div>
            <h2 className="text-3xl font-bold">Jane Doe</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">jane.doe@example.com</p>
        </div>

        <div className="space-y-4">
            <div className={`p-4 rounded-xl flex justify-between items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-pink-500" />
                    <span>My Orders (3 Completed)</span>
                </div>
                <Button variant="ghost" size="sm">View History</Button>
            </div>
            
            <div className={`p-4 rounded-xl flex justify-between items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-purple-500" />
                    <span>Account Settings</span>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
            </div>

            <Button onClick={onLogout} variant="outline" className="w-full mt-6 flex items-center justify-center gap-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                <LogOut className="w-5 h-5" />
                Logout
            </Button>
        </div>
    </div>
);
