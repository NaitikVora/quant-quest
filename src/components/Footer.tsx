import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  ExternalLink,
  Heart
} from 'lucide-react';

export const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    product: [
      { label: 'Features', path: '/#features' },
      { label: 'Skills', path: '/skill-progression' },
      { label: 'Leaderboard', path: '/leaderboard' },
      { label: '1v1 Challenges', path: '/1v1' },
      { label: 'Community', path: '/community' }
    ],
    learn: [
      { label: 'Documentation', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Best Practices', href: '#' }
    ],
    community: [
      { label: 'Discord', href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'LinkedIn', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Bug Reports', href: '#' },
      { label: 'Feature Requests', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' }
  ];

  return (
    <footer className="bg-card/30 border-t border-border/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-mono font-bold text-foreground">
                QUANTQUEST
              </span>
            </div>
            <p className="text-muted-foreground font-mono text-sm mb-6 max-w-md">
              Master quantitative finance through interactive simulations, 
              skill development, and competitive challenges. Join the elite 
              community of algorithmic traders.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-primary/10"
                    onClick={() => window.open(social.href, '_blank')}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{social.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-mono font-semibold text-foreground mb-4">
              PRODUCT
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-mono text-sm text-muted-foreground hover:text-foreground justify-start"
                    onClick={() => {
                      if (link.path) {
                        navigate(link.path);
                      } else if (link.href) {
                        window.open(link.href, '_blank');
                      }
                    }}
                  >
                    {link.label}
                    {link.href && <ExternalLink className="h-3 w-3 ml-1" />}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn Links */}
          <div>
            <h3 className="font-mono font-semibold text-foreground mb-4">
              LEARN
            </h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.label}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-mono text-sm text-muted-foreground hover:text-foreground justify-start"
                    onClick={() => {
                      if (link.path) {
                        navigate(link.path);
                      } else if (link.href) {
                        window.open(link.href, '_blank');
                      }
                    }}
                  >
                    {link.label}
                    {link.href && <ExternalLink className="h-3 w-3 ml-1" />}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Support */}
          <div>
            <h3 className="font-mono font-semibold text-foreground mb-4">
              COMMUNITY
            </h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-mono text-sm text-muted-foreground hover:text-foreground justify-start"
                    onClick={() => {
                      if (link.path) {
                        navigate(link.path);
                      } else if (link.href) {
                        window.open(link.href, '_blank');
                      }
                    }}
                  >
                    {link.label}
                    {link.href && <ExternalLink className="h-3 w-3 ml-1" />}
                  </Button>
                </li>
              ))}
            </ul>

            <h3 className="font-mono font-semibold text-foreground mb-4">
              SUPPORT
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-mono text-sm text-muted-foreground hover:text-foreground justify-start"
                    onClick={() => {
                      if (link.path) {
                        navigate(link.path);
                      } else if (link.href) {
                        window.open(link.href, '_blank');
                      }
                    }}
                  >
                    {link.label}
                    {link.href && <ExternalLink className="h-3 w-3 ml-1" />}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <span>© 2025 QuantQuest. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for quantitative traders.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-mono">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => window.open('#', '_blank')}
              >
                Privacy Policy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => window.open('#', '_blank')}
              >
                Terms of Service
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => window.open('#', '_blank')}
              >
                Cookie Policy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
