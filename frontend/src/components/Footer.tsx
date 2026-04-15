const Footer = () => (
  <footer className="bg-foreground text-primary-foreground mt-8">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-3 text-muted-foreground uppercase text-xs">About</h4>
          <ul className="space-y-1.5 text-primary-foreground/70">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-muted-foreground uppercase text-xs">Help</h4>
          <ul className="space-y-1.5 text-primary-foreground/70">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-muted-foreground uppercase text-xs">Policy</h4>
          <ul className="space-y-1.5 text-primary-foreground/70">
            <li>Return Policy</li>
            <li>Terms of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-muted-foreground uppercase text-xs">Social</h4>
          <ul className="space-y-1.5 text-primary-foreground/70">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>YouTube</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-6 pt-4 text-center text-xs text-primary-foreground/50">
        © 2026 Flipkart Clone.
      </div>
    </div>
  </footer>
);

export default Footer;
