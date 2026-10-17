import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { businessProfileRepository } from '../repositories/businessProfile.repository';
import { DatabaseUnavailableError } from '../repositories/enquiry.repository';
import { DEMO_TENANT_ID } from '../types/enquiry.types';
import { UpdateBusinessProfileDTO } from '../types/businessProfile.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * GET /api/business-profile
 * Retrieve business profile for the authenticated tenant,
 * or the public demo profile if unauthenticated.
 */
export const getBusinessProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isConnected = businessProfileRepository.isConnected();
    res.setHeader('X-Database-Status', isConnected ? 'connected' : 'disconnected');

    const businessId = req.user?.businessId || DEMO_TENANT_ID;
    const profile = await businessProfileRepository.findByBusinessId(businessId);

    if (!profile) {
      res.status(404).json({
        status: 'error',
        message: 'Business profile not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      res.status(503).json({
        status: 'error',
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

/**
 * GET /api/business-profile/public/:businessId
 * Retrieve public showcase profile for a specific businessId.
 */
export const getPublicBusinessProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isConnected = businessProfileRepository.isConnected();
    res.setHeader('X-Database-Status', isConnected ? 'connected' : 'disconnected');

    const businessIdParam = Array.isArray(req.params.businessId)
      ? req.params.businessId[0]
      : req.params.businessId;

    if (!businessIdParam || businessIdParam.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Business ID parameter is required',
      });
      return;
    }

    const profile = await businessProfileRepository.findByBusinessId(businessIdParam.trim());

    if (!profile) {
      res.status(404).json({
        status: 'error',
        message: `Business profile not found for business ID "${businessIdParam.trim()}"`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      res.status(503).json({
        status: 'error',
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

/**
 * PUT or PATCH /api/business-profile
 * Update business profile fields for the authenticated business owner.
 * Strictly enforces business ownership: mutations only apply to req.user.businessId.
 */
export const updateBusinessProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isConnected = businessProfileRepository.isConnected();
    res.setHeader('X-Database-Status', isConnected ? 'connected' : 'disconnected');

    const businessId = req.user?.businessId;

    if (!businessId) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required. Missing business identity.',
      });
      return;
    }

    if (businessId === DEMO_TENANT_ID) {
      res.status(403).json({
        status: 'error',
        message: 'The public demo business profile cannot be modified.',
      });
      return;
    }

    const {
      businessName,
      tagline,
      description,
      contact,
      location,
      categories,
    } = req.body as Partial<UpdateBusinessProfileDTO>;

    // 1. Validate businessName
    if (businessName !== undefined) {
      if (typeof businessName !== 'string' || businessName.trim().length < 2) {
        res.status(400).json({
          status: 'error',
          message: 'Business name must be a string with at least 2 characters.',
        });
        return;
      }
      if (businessName.trim().length > 100) {
        res.status(400).json({
          status: 'error',
          message: 'Business name cannot exceed 100 characters.',
        });
        return;
      }
    }

    // 2. Validate tagline
    if (tagline !== undefined) {
      if (typeof tagline !== 'string') {
        res.status(400).json({
          status: 'error',
          message: 'Tagline must be a string.',
        });
        return;
      }
      if (tagline.trim().length > 150) {
        res.status(400).json({
          status: 'error',
          message: 'Tagline cannot exceed 150 characters.',
        });
        return;
      }
    }

    // 3. Validate description
    if (description !== undefined) {
      if (typeof description !== 'string') {
        res.status(400).json({
          status: 'error',
          message: 'Description must be a string.',
        });
        return;
      }
      if (description.trim().length > 2000) {
        res.status(400).json({
          status: 'error',
          message: 'Description cannot exceed 2000 characters.',
        });
        return;
      }
    }

    // 4. Validate contact info
    if (contact !== undefined) {
      if (typeof contact !== 'object' || contact === null) {
        res.status(400).json({
          status: 'error',
          message: 'Contact must be an object containing email, phone, or website.',
        });
        return;
      }

      if (contact.email !== undefined) {
        if (typeof contact.email !== 'string' || !EMAIL_REGEX.test(contact.email.trim())) {
          res.status(400).json({
            status: 'error',
            message: 'A valid email address is required for business contact.',
          });
          return;
        }
        if (contact.email.trim().length > 120) {
          res.status(400).json({
            status: 'error',
            message: 'Contact email cannot exceed 120 characters.',
          });
          return;
        }
      }

      if (contact.phone !== undefined) {
        if (typeof contact.phone !== 'string') {
          res.status(400).json({
            status: 'error',
            message: 'Contact phone must be a string.',
          });
          return;
        }
        if (contact.phone.trim().length > 30) {
          res.status(400).json({
            status: 'error',
            message: 'Contact phone cannot exceed 30 characters.',
          });
          return;
        }
      }

      if (contact.website !== undefined) {
        if (typeof contact.website !== 'string') {
          res.status(400).json({
            status: 'error',
            message: 'Contact website must be a string.',
          });
          return;
        }
        if (contact.website.trim().length > 200) {
          res.status(400).json({
            status: 'error',
            message: 'Contact website cannot exceed 200 characters.',
          });
          return;
        }
      }
    }

    // 5. Validate location
    if (location !== undefined) {
      if (typeof location !== 'object' || location === null) {
        res.status(400).json({
          status: 'error',
          message: 'Location must be an object containing address, city, state, postalCode, country.',
        });
        return;
      }

      if (location.city !== undefined) {
        if (typeof location.city !== 'string' || location.city.trim().length < 1) {
          res.status(400).json({
            status: 'error',
            message: 'City must be at least 1 character long.',
          });
          return;
        }
        if (location.city.trim().length > 100) {
          res.status(400).json({
            status: 'error',
            message: 'City cannot exceed 100 characters.',
          });
          return;
        }
      }

      if (location.address !== undefined) {
        if (typeof location.address !== 'string' || location.address.trim().length > 200) {
          res.status(400).json({
            status: 'error',
            message: 'Address cannot exceed 200 characters.',
          });
          return;
        }
      }

      if (location.state !== undefined) {
        if (typeof location.state !== 'string' || location.state.trim().length > 100) {
          res.status(400).json({
            status: 'error',
            message: 'State cannot exceed 100 characters.',
          });
          return;
        }
      }

      if (location.postalCode !== undefined) {
        if (typeof location.postalCode !== 'string' || location.postalCode.trim().length > 20) {
          res.status(400).json({
            status: 'error',
            message: 'Postal code cannot exceed 20 characters.',
          });
          return;
        }
      }

      if (location.country !== undefined) {
        if (typeof location.country !== 'string' || location.country.trim().length > 100) {
          res.status(400).json({
            status: 'error',
            message: 'Country cannot exceed 100 characters.',
          });
          return;
        }
      }
    }

    // 6. Validate categories
    if (categories !== undefined) {
      if (!Array.isArray(categories)) {
        res.status(400).json({
          status: 'error',
          message: 'Categories must be an array of service category strings.',
        });
        return;
      }

      if (categories.length === 0) {
        res.status(400).json({
          status: 'error',
          message: 'At least one service category is required.',
        });
        return;
      }

      if (categories.length > 15) {
        res.status(400).json({
          status: 'error',
          message: 'Cannot specify more than 15 service categories.',
        });
        return;
      }

      for (const cat of categories) {
        if (typeof cat !== 'string' || cat.trim().length < 2 || cat.trim().length > 50) {
          res.status(400).json({
            status: 'error',
            message: 'Each service category must be a string between 2 and 50 characters.',
          });
          return;
        }
      }
    }

    // Perform atomic update scoped strictly to caller's authenticated businessId
    const updatedProfile = await businessProfileRepository.updateProfile(
      businessId,
      {
        businessName,
        tagline,
        description,
        contact,
        location,
        categories,
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Business profile updated successfully',
      data: updatedProfile,
    });
  } catch (error: any) {
    if (error?.code === 'DEMO_READ_ONLY') {
      res.status(403).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    if (error instanceof DatabaseUnavailableError) {
      res.status(503).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    next(error);
  }
};
