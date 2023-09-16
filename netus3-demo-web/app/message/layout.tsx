import Navbar from '@/app/components/Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="mt-16">
			<Navbar />
			{children}
		</div>
	)
}
